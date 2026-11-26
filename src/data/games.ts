import type { DailyCatalog, GameCatalogEntry } from '../types';
import reharmCover from '../../assets/covers/reharm.svg?url';
import chordTrenchCover from '../../assets/covers/chord-trench.svg?url';
import stepwiseCover from '../../assets/covers/stepwise.svg?url';
import quartetCover from '../../assets/covers/quartet.svg?url';
import mendCover from '../../assets/covers/mend.svg?url';
import barlineCover from '../../assets/covers/barline.svg?url';
import tavdleCover from '../../assets/covers/tavdle.svg?url';
import makeTheChangesCover from '../../assets/covers/make-the-changes.svg?url';

export const HUB_URL = 'https://itailiors.github.io/reharm-daily/';
export const LAB_URL = 'https://itailiors.github.io/reharm-lab/';

/** Reharm Lab deep link for a move (bridge-spec.md §3). */
export function labMoveUrl(slug: string): string {
  return `${LAB_URL}?move=${encodeURIComponent(slug)}&from=reharm-daily`;
}

const games: GameCatalogEntry[] = [
  {
    id: 'reharm',
    name: 'REHARM',
    status: 'live',
    url: 'https://itailiors.github.io/reharm/',
    cover: reharmCover,
    shareEmoji: '🎛️',
    pitch: 'Four bars. One melody. Pick the chords; rarer harmony scores higher.',
    archetype: 'Open-ended reharmonization',
    estMinutes: 3,
    mutedFriendly: 'partly',
    mutedLabel: 'Muted OK (Partly)',
    mutedNote: 'Visual playhead and contour work muted; Rhodes audio recommended.',
    scoreUnit: 'Spice score 0–100 + rarity',
    howToPlay: [
      "Hear today's 4-bar melody (one bar is locked as the harmonic anchor).",
      'Drop chords into the open bars with the 2-tap palette or the piano.',
      'Lock your mix: any legal progression passes, rarer moves score higher.',
    ],
    storagePrefix: 'reharm:v1:',
    labLinks: [
      { slug: 'tritone-sub', label: 'Tritone Sub' },
      { slug: 'backdoor-dominant', label: 'Backdoor Dominant' },
      { slug: 'modal-interchange', label: 'Modal Interchange' },
      { slug: 'chromatic-mediant', label: 'Chromatic Mediant' },
    ],
  },
  {
    id: 'chord-trench',
    name: 'CHORD TRENCH',
    status: 'planned',
    cover: chordTrenchCover,
    shareEmoji: '🌊',
    pitch: 'Six timed rounds. Any valid chord survives; spicier chords dive deeper.',
    archetype: 'Timed chord building',
    estMinutes: 3,
    mutedFriendly: 'yes',
    mutedLabel: 'Silent OK',
    mutedNote: 'Fully playable muted with the pitch-class keyboard and live chord labels.',
    scoreUnit: 'Depth in metres (max 600m)',
    howToPlay: [
      'Six 25-second rounds, each with a harmonic constraint to satisfy.',
      'Once you use a chord quality it locks out for the remaining rounds.',
      'Plain triads stay shallow; rare voicings plunge toward 600m.',
    ],
  },
  {
    id: 'stepwise',
    name: 'STEPWISE',
    status: 'live',
    url: 'https://itailiors.github.io/stepwise/',
    cover: stepwiseCover,
    shareEmoji: '🪜',
    pitch: 'Morph one chord into another, one voice and one step at a time. Beat Par.',
    archetype: 'Voice-leading ladder',
    estMinutes: 2,
    mutedFriendly: 'yes',
    mutedLabel: 'Silent OK',
    mutedNote: 'Pure voice-leading logic on a 12-note track; no audio required.',
    scoreUnit: 'Steps vs Par (golf terms)',
    howToPlay: [
      "Start from a 3- or 4-note chord and see today's target chord and Par.",
      'Move exactly one voice by one or two semitones to form another valid chord.',
      'Reach the target within Par + 3 moves to hear your ladder play back.',
    ],
    storagePrefix: 'stepwise:',
    epoch: '2026-11-26',
    labLinks: [{ slug: 'diminished-pivot', label: 'Diminished Pivot' }],
  },
  {
    id: 'quartet',
    name: 'QUARTET',
    status: 'planned',
    cover: quartetCover,
    shareEmoji: '🎼',
    pitch: 'Sixteen sounds, four hidden groups. Hear the connections.',
    archetype: 'Grouping by ear',
    estMinutes: 4,
    mutedFriendly: 'no',
    mutedLabel: 'Audio first',
    mutedNote: 'Designed for headphones or speakers.',
    scoreUnit: 'Mistakes left (0–4)',
    howToPlay: [
      'Tap any of the 16 tiles to hear a short chord, interval or rhythm.',
      'Find the 4 hidden families and submit them in groups of four.',
      'Solve with mistakes to spare to earn the Pure Ear stamp.',
    ],
  },
  {
    id: 'mend',
    name: 'MEND',
    status: 'live',
    url: 'https://itailiors.github.io/mend/',
    cover: mendCover,
    shareEmoji: '🩺',
    pitch: "Today's groove has four bugs. Find them, fix them, hear it click.",
    archetype: 'Ear + harmony repair',
    estMinutes: 4,
    mutedFriendly: 'no',
    mutedLabel: 'Sound on',
    mutedNote: 'Ear-guided repair across melody, chord, bass and cadence lanes.',
    scoreUnit: 'Bugs fixed / listens used',
    howToPlay: [
      "Loop today's 4-bar track: it hides 4 deliberate glitches.",
      'Open each lane (melody, chords, bass, cadence) and fix what sounds wrong.',
      'Fewer listens and taps score higher.',
    ],
    storagePrefix: 'mend:',
    epoch: '2026-10-07',
    labLinks: [{ slug: 'lydian-sharp4', label: 'Lydian #4' }],
  },
  {
    id: 'barline',
    name: 'BARLINE',
    status: 'planned',
    cover: barlineCover,
    shareEmoji: '🥁',
    pitch: 'Feel the downbeat. Tap Beat 1, then slice the odd meter.',
    archetype: 'Rhythm / meter',
    estMinutes: 2,
    mutedFriendly: 'partly',
    mutedLabel: 'Muted OK (Partly)',
    mutedNote: 'A visual pulse ring works muted, but the groove lives in the audio.',
    scoreUnit: 'Timing accuracy',
    howToPlay: [
      'Listen to riffs that grow from 3/4 to 7/8 and beyond.',
      'Tap Beat 1 on the pad for three bars in a row.',
      'Slice the subdivision ring into its grouping (like 2+2+3).',
    ],
  },
  {
    id: 'tavdle',
    name: 'TAVDLE',
    status: 'planned',
    cover: tavdleCover,
    shareEmoji: '🎵',
    pitch: 'A daily note-and-melody deduction puzzle. Rules are on the workbench.',
    archetype: 'Melody deduction',
    estMinutes: 2,
    mutedFriendly: 'tbd',
    mutedLabel: 'TBD',
    mutedNote: 'Rules are still in design.',
    scoreUnit: 'TBD',
    howToPlay: [
      'A daily note and melody deduction puzzle (rules in design).',
      'Turn on the bell to spotlight it here on launch day.',
      'No account or email: the reminder is saved on this device only.',
    ],
  },
  {
    id: 'make-the-changes',
    name: 'Make the Changes',
    status: 'lab',
    url: `${LAB_URL}?mode=changes&from=reharm-daily`,
    cover: makeTheChangesCover,
    shareEmoji: '🎹',
    pitch: 'Hear and play root movements and functions. Open practice inside Reharm Lab.',
    archetype: 'Practice (not a daily)',
    estMinutes: 5,
    mutedFriendly: 'no',
    mutedLabel: 'Sound on',
    mutedNote: 'Open practice in Reharm Lab with MIDI, keyboard or mouse.',
    scoreUnit: 'Points + practice streak',
    howToPlay: [
      "Opens Reharm Lab's Changes tab directly.",
      'Hear where a chord wants to resolve and play the root movement.',
      'Pure practice: never expires at midnight and never touches your daily streak.',
    ],
  },
];

export const CATALOG: DailyCatalog = {
  hub: { name: 'Reharm Daily', url: HUB_URL, epoch: '2026-11-25' },
  lab: { name: 'Reharm Lab', url: LAB_URL },
  games,
};
