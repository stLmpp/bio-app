import { sveltekit } from '@sveltejs/kit/vite';
import { spawnSync } from 'child_process';
import { defineConfig, type PluginOption } from 'vite';

function sassWatch(): PluginOption {
  return {
    name: 'sass-watch',
    buildStart: () => {
      spawnSync('npm', ['run', 'compile-css'], { shell: true });
    },
    handleHotUpdate: ({ file, server }) => {
      if (/\.scss$/.test(file)) {
        spawnSync('npm', ['run', 'compile-css'], { shell: true });
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
  };
});
