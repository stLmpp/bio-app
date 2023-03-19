<script lang="ts">
  import './global.scss';
  import { SvelteUIProvider } from '@svelteuidev/core';
</script>

<SvelteUIProvider themeObserver="dark" withNormalizeCSS withGlobalStyles>
  <slot />
</SvelteUIProvider>
