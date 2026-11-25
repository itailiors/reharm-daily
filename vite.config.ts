import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/** dist path → source path. Emitted un-hashed: crawlers and home-screen icons need stable URLs. */
const STATIC_FILES: Record<string, string> = {
  'og-image.jpg': './assets/brand/og-image.jpg',
  'og-image.png': './assets/brand/og-image.png',
  'apple-touch-icon.png': './assets/brand/apple-touch-icon.png',
  'favicon.svg': './assets/brand/favicon.svg',
};

function staticFiles(): Plugin {
  return {
    name: 'reharm-daily-static-files',
    apply: 'build',
    generateBundle() {
      for (const [fileName, src] of Object.entries(STATIC_FILES)) {
        this.emitFile({ type: 'asset', fileName, source: readFileSync(fileURLToPath(new URL(src, import.meta.url))) });
      }
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: 'User-agent: *\nAllow: /\n' });
      // GitHub Pages: serve files as-is (no Jekyll processing).
      this.emitFile({ type: 'asset', fileName: '.nojekyll', source: '' });
    },
  };
}

export default defineConfig({
  // Relative base works at /reharm-daily/ on GitHub Pages and at / in local preview.
  base: './',
  publicDir: false,
  plugins: [staticFiles()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    sourcemap: false,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
