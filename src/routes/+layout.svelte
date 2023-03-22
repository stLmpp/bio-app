<script lang="ts">
  import './global.scss';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import { isNavigating, setIsNavigating } from '$lib/stores/navigating';
  import { ProgressBar } from 'carbon-components-svelte';
  import { slide } from 'svelte/transition';
  import { debounceTime } from 'rxjs';

  beforeNavigate(() => {
    setIsNavigating(true);
  });

  afterNavigate(() => {
    setIsNavigating(false);
  });

  const isNavigatingWithDebounceTime = isNavigating.pipe(debounceTime(200));
</script>

{#if $isNavigatingWithDebounceTime}
  <div class="progress-bar" transition:slide>
    <ProgressBar size="sm" />
  </div>
{/if}

<slot />

<style lang="scss">
  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    :global(.bx--progress-bar__label) {
      margin-bottom: 0;
    }
  }
</style>
