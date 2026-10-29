import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: false,
    // Satır içi script/stil üretmesin (CSP: unsafe-inline yok)
    assetsInlineLimit: 0,
    modulePreload: { polyfill: false },
  },
});
