import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';

export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [sveltekit()];
  if (mode === 'development') {
    plugins.unshift(nodeLoaderPlugin());
  }
  return {
    plugins,
  };
});
