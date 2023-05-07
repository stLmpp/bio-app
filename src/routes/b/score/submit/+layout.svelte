<script>
  import { ProgressIndicator, ProgressStep } from 'carbon-components-svelte';

  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import Seo from '$lib/components/Seo.svelte';

  const indexArray = [
    { key: 'platformId', index: 0 },
    { key: 'gameId', index: 1 },
    { key: 'platformGameMiniGameId', index: 2 },
    { key: 'platformGameMiniGameModeId', index: 3 },
    { key: 'platformGameMiniGameModeStageId', index: 4 },
  ];

  $: currentIndex = indexArray.find(({ key }) => !$page.params[key])?.index ?? 5;
</script>

<h1>Submit a new score</h1>

<ProgressIndicator
  {currentIndex}
  spaceEqually
  class="progress"
  preventChangeOnClick={!browser}
>
  {@const {
    platformId,
    gameId,
    platformGameMiniGameId,
    platformGameMiniGameModeId,
    platformGameMiniGameModeStageId,
  } = $page.params}
  <ProgressStep
    label="Platform"
    complete={!!platformId}
    on:click={() => {
      goto('/b/score/submit');
    }}
  />
  <ProgressStep
    label="Game"
    complete={!!gameId}
    disabled={!platformId}
    on:click={() => {
      goto(`/b/score/submit/p/${platformId}`);
    }}
  />
  <ProgressStep
    label="Mini game"
    complete={!!platformGameMiniGameId}
    disabled={!gameId}
    on:click={() => {
      goto(`/b/score/submit/p/${platformId}/g/${gameId}`);
    }}
  />
  <ProgressStep
    label="Mode"
    complete={!!platformGameMiniGameModeId}
    disabled={!platformGameMiniGameId}
    on:click={() => {
      goto(`/b/score/submit/p/${platformId}/g/${gameId}/mg/${platformGameMiniGameId}`);
    }}
  />
  <ProgressStep
    label="Stage"
    complete={!!platformGameMiniGameModeStageId}
    disabled={!platformGameMiniGameModeId}
    on:click={() => {
      goto(
        `/b/score/submit/p/${platformId}/g/${gameId}/mg/${platformGameMiniGameId}/m/${platformGameMiniGameModeId}`
      );
    }}
  />
  <ProgressStep label="Score" disabled={!$page.params.platformGameMiniGameModeStageId} />
</ProgressIndicator>

<Seo title="Submit a new score" description="Submit a new score" />

<main>
  <slot />
</main>

<style lang="scss">
  h1 {
    margin-bottom: 1rem;
  }

  main {
    margin-top: 1rem;
  }
</style>
