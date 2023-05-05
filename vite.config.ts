import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';

export default defineConfig(() => {
  const plugins: PluginOption[] = [sveltekit()];
  return {
    plugins,
  };
});
