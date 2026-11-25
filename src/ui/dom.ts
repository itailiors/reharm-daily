/** Tiny DOM helpers. All dynamic text goes through `esc` before it reaches innerHTML. */

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function esc(v: unknown): string {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]!);
}

/** `<svg>` referencing a symbol from assets/icons/sprite.svg (injected once at boot). */
export function icon(name: string, cls = 'ico-sm'): string {
  return `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#icon-${name}"/></svg>`;
}

export function $(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`#${id} missing`);
  return el;
}

export function prefersReducedMotion(): boolean {
  return (
    document.documentElement.dataset.reducedMotion === 'true' ||
    (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  );
}
