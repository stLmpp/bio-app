import { sveltekit } from '@sveltejs/kit/vite';
import { optimizeCss } from 'carbon-preprocess-svelte';
import { defineConfig, type PluginOption } from 'vite';

const plugins: PluginOption[] = [sveltekit()];

if (process.env.NODE_ENV === 'production') {
  plugins.push(optimizeCss());
}

export default defineConfig({
  plugins,
});
