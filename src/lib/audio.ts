/**
 * Optional hub UI micro-sounds (motion-spec.md §3). Pure Web Audio oscillators, no files.
 * Silent unless prefs.uiSounds && !prefs.mutedDefault. The AudioContext is created lazily
 * and resumed inside a user gesture (browsers block audio before one).
 */
type Cue = 'stamp' | 'clean' | 'bell' | 'copy';

let ctx: AudioContext | null = null;
let enabled = false;

export function setSoundsEnabled(on: boolean): void {
  enabled = on;
}

/** Call from a pointer/key handler: creates or resumes the context while a gesture is active. */
export function unlockAudio(): void {
  if (!enabled) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    ctx = null;
  }
}

function tone(c: AudioContext, freq: number, at: number, type: OscillatorType, gain: number, attack: number, decay: number): void {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(gain, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  osc.connect(g).connect(c.destination);
  osc.start(at);
  osc.stop(at + attack + decay + 0.02);
}

export function playCue(cue: Cue): void {
  if (!enabled || !ctx || ctx.state !== 'running') return;
  const c = ctx;
  const t = c.currentTime + 0.01;
  switch (cue) {
    case 'stamp': // C5 → G5 soft fifth
      tone(c, 523.25, t, 'triangle', 0.08, 0.01, 0.16);
      tone(c, 783.99, t + 0.06, 'triangle', 0.08, 0.01, 0.16);
      break;
    case 'clean': // C5 E5 G5 D6, 70ms apart
      [523.25, 659.25, 783.99, 1174.66].forEach((f, i) => {
        tone(c, f, t + i * 0.07, 'sine', 0.07, 0.01, 0.28);
        tone(c, f, t + i * 0.07, 'triangle', 0.025, 0.01, 0.2);
      });
      break;
    case 'bell': // A5 brass ping
      tone(c, 880, t, 'triangle', 0.05, 0.004, 0.09);
      break;
    case 'copy': {
      // 25ms band-passed noise click
      const len = Math.floor(c.sampleRate * 0.025);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = c.createBufferSource();
      const bp = c.createBiquadFilter();
      const g = c.createGain();
      bp.type = 'bandpass';
      bp.frequency.value = 1200;
      g.gain.value = 0.04;
      src.buffer = buf;
      src.connect(bp).connect(g).connect(c.destination);
      src.start(t);
      break;
    }
  }
}
