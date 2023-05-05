import { vitePreprocess } from '@sveltejs/kit/vite';
import firebase from 'svelte-adapter-firebase';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    vitePreprocess(),
    // optimizeImports(),
    // icons(), https://github.com/carbon-design-system/carbon-preprocess-svelte/issues/28
    // elements({ cssVars: true, theme: 'g100' }),
  ],
  onwarn: (warning, handler) => {
    if (warning.filename.startsWith('/node_modules/')) {
      return;
    }
    handler(warning);
  },
  kit: {
    adapter: firebase(),
    alias: {
      $lib: 'src/lib',
    },
  },
};

export default config;
