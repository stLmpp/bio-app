import { sveltekit } from '@sveltejs/kit/vite';
import { spawnSync } from 'child_process';
import { defineConfig, type PluginOption } from 'vite';

function sassWatch(): PluginOption {
  function buildCss() {
    spawnSync('npm', ['run', 'compile-css'], { shell: true });
  }

  return {
    name: 'sass-watch',
    buildStart: async () => {
      buildCss();
    },
    handleHotUpdate: async ({ file, server }) => {
      if (/\.scss$/.test(file)) {
        buildCss();
        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
      }
    },
  };
}

export default defineConfig(() => {
  const plugins: PluginOption[] = [sveltekit(), sassWatch()];
  return {
    plugins,
    optimizeDeps: {
      exclude: ['carbon-components-svelte', 'carbon-icons-svelte'],
    },
  };
});
