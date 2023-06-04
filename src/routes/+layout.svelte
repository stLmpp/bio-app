<script lang="ts">
  import '../app.postcss';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { isNavigating, setIsNavigating } from '$lib/stores/navigating';
  import { isRequesting } from '$lib/stores/requesting';
  import { ProgressBar } from 'carbon-components-svelte';
  import { combineLatest, debounceTime, map } from 'rxjs';
  import { slide } from 'svelte/transition';
  import { browser } from '$app/environment';

  beforeNavigate(() => {
    setIsNavigating(true);
  });

  afterNavigate(() => {
    setIsNavigating(false);
  });

  const isNavigatingWithDebounceTime = combineLatest([isNavigating, isRequesting]).pipe(
    debounceTime(200),
    map((sources) => sources.some((source) => source))
  );
</script>

{#if browser && $isNavigatingWithDebounceTime}
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
    z-index: 8001; // Greater than header
    :global(.bx--progress-bar__label) {
      margin-bottom: 0;
    }
  }
</style>
