import firebase from 'svelte-adapter-firebase';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: firebase(),
    alias: {
      $lib: 'src/lib',
    },
  },
};

export default config;
