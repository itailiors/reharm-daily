/**
 * SafeStorage (data-contract.md §4): every localStorage access is wrapped. If the startup
 * probe fails (Safari Private Browsing, disabled site data, quota) or a later write throws,
 * the hub switches to an in-memory Map for the rest of the session and reports `blocked`.
 */

export interface KVBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key(index: number): string | null;
  readonly length: number;
}

export const PROBE_KEY = '__daily_probe__';

export class SafeStorage {
  private readonly memory = new Map<string, string>();
  private backend: KVBackend | null;
  private _blocked: boolean;

  constructor(backend: KVBackend | null | (() => KVBackend | null)) {
    let b: KVBackend | null = null;
    try {
      b = typeof backend === 'function' ? backend() : backend;
    } catch {
      b = null; // accessing window.localStorage itself can throw SecurityError
    }
    this.backend = b;
    this._blocked = !b || !SafeStorage.probe(b);
    if (this._blocked) this.backend = null;
  }

  /** The default instance for the browser. */
  static browser(): SafeStorage {
    return new SafeStorage(() => (typeof window === 'undefined' ? null : window.localStorage));
  }

  private static probe(b: KVBackend): boolean {
    try {
      b.setItem(PROBE_KEY, '1');
      const ok = b.getItem(PROBE_KEY) === '1';
      b.removeItem(PROBE_KEY);
      return ok;
    } catch {
      return false;
    }
  }

  /** True when data will not outlive this tab. */
  get blocked(): boolean {
    return this._blocked;
  }

  private fallBack(): void {
    if (!this.backend) return;
    // Keep what we can still read so the session continues seamlessly.
    try {
      for (let i = 0; i < this.backend.length; i++) {
        const k = this.backend.key(i);
        if (k !== null && !this.memory.has(k)) {
          const v = this.backend.getItem(k);
          if (v !== null) this.memory.set(k, v);
        }
      }
    } catch {
      /* ignore */
    }
    this.backend = null;
    this._blocked = true;
  }

  get(key: string): string | null {
    if (this.backend) {
      try {
        return this.backend.getItem(key);
      } catch {
        this.fallBack();
      }
    }
    return this.memory.get(key) ?? null;
  }

  set(key: string, value: string): void {
    if (this.backend) {
      try {
        this.backend.setItem(key, value);
        return;
      } catch {
        this.fallBack();
      }
    }
    this.memory.set(key, value);
  }

  remove(key: string): void {
    if (this.backend) {
      try {
        this.backend.removeItem(key);
        return;
      } catch {
        this.fallBack();
      }
    }
    this.memory.delete(key);
  }

  /** Parse JSON; any missing/corrupt payload yields `null` (never throws). */
  getJSON<T = unknown>(key: string): T | null {
    const raw = this.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  setJSON(key: string, value: unknown): void {
    let raw: string;
    try {
      raw = JSON.stringify(value);
    } catch {
      return;
    }
    this.set(key, raw);
  }
}

/** Plain in-memory backend (tests, and anything that wants a scratch store). */
export function memoryBackend(seed: Record<string, string> = {}): KVBackend {
  const m = new Map(Object.entries(seed));
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, String(v)),
    removeItem: (k) => void m.delete(k),
    key: (i) => [...m.keys()][i] ?? null,
    get length() {
      return m.size;
    },
  };
}
