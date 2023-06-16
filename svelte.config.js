import sveltePreprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-node';
import { optimizeCss, optimizeImports } from 'carbon-preprocess-svelte';

const preprocess = [
  vitePreprocess(),
  sveltePreprocess({
    postcss: true,
  }),
  optimizeImports(),
];

if (process.env.NODE_ENV === 'production') {
  preprocess.push(optimizeCss());
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess,
  onwarn: (warning, handler) => {
    if (warning.filename.startsWith('/node_modules/')) {
      return;
    }
    handler(warning);
  },
  kit: {
    adapter: adapter(),
    alias: {
      $lib: 'src/lib',
    },
  },
  compilerOptions: {
    immutable: true,
  },
};

export default config;
