import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';

const plugins: PluginOption[] = [sveltekit()];

export default defineConfig({
  plugins,
});
