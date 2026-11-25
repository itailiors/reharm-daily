import { describe, expect, it } from 'vitest';
import { PROBE_KEY, SafeStorage, memoryBackend, type KVBackend } from '../src/lib/storage';

function throwingBackend(): KVBackend {
  const err = () => {
    const e = new Error('blocked');
    e.name = 'SecurityError';
    throw e;
  };
  return { getItem: err, setItem: err, removeItem: err, key: err, get length() { return err(); } };
}

describe('SafeStorage', () => {
  it('uses the real backend when the probe succeeds and cleans up the probe key', () => {
    const b = memoryBackend();
    const s = new SafeStorage(b);
    expect(s.blocked).toBe(false);
    s.set('a', '1');
    expect(b.getItem('a')).toBe('1');
    expect(b.getItem(PROBE_KEY)).toBeNull();
  });

  it('falls back to memory when storage throws on access (Safari private mode)', () => {
    const s = new SafeStorage(throwingBackend());
    expect(s.blocked).toBe(true);
    s.set('k', 'v');
    expect(s.get('k')).toBe('v');
    s.remove('k');
    expect(s.get('k')).toBeNull();
  });

  it('falls back when the backend getter itself throws', () => {
    const s = new SafeStorage(() => {
      throw new Error('SecurityError');
    });
    expect(s.blocked).toBe(true);
    s.setJSON('x', { a: 1 });
    expect(s.getJSON('x')).toEqual({ a: 1 });
  });

  it('falls back when there is no backend', () => {
    expect(new SafeStorage(null).blocked).toBe(true);
  });

  it('switches to memory mid-session on QuotaExceededError and keeps existing data readable', () => {
    const b = memoryBackend({ keep: 'me' });
    let full = false;
    const quota: KVBackend = {
      ...b,
      getItem: (k) => b.getItem(k),
      setItem: (k, v) => {
        if (full) {
          const e = new Error('full');
          e.name = 'QuotaExceededError';
          throw e;
        }
        b.setItem(k, v);
      },
      removeItem: (k) => b.removeItem(k),
      key: (i) => b.key(i),
      get length() {
        return b.length;
      },
    };
    const s = new SafeStorage(quota);
    expect(s.blocked).toBe(false);
    full = true;
    s.set('new', 'value');
    expect(s.blocked).toBe(true);
    expect(s.get('new')).toBe('value');
    expect(s.get('keep')).toBe('me');
  });

  it('getJSON returns null for corrupt payloads instead of throwing', () => {
    const s = new SafeStorage(memoryBackend({ bad: '{nope', good: '{"a":2}' }));
    expect(s.getJSON('bad')).toBeNull();
    expect(s.getJSON('missing')).toBeNull();
    expect(s.getJSON('good')).toEqual({ a: 2 });
  });
});
