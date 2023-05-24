import { sveltekit } from '@sveltejs/kit/vite';
import { spawnSync } from 'child_process';
import { defineConfig, type PluginOption } from 'vite';

function sassWatch(): PluginOption {
  async function buildCss() {
    spawnSync('npm', ['run', 'compile-css'], { shell: true });
    // const purge = await new PurgeCSS().purge({
    // TODO make this work https://github.dev/carbon-design-system/carbon-preprocess-svelte/tree/main/src
    //   content: ['src/**.{html,svelte}'],
    //   css: ['static/global.css'],
    // });
    // await writeFile('static/global.css', purge[0].css);
  }

  return {
    name: 'sass-watch',
    buildStart: async () => {
      await buildCss();
    },
    handleHotUpdate: async ({ file, server }) => {
      if (/\.scss$/.test(file)) {
        await buildCss();
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
