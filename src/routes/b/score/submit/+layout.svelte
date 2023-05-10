<script lang="ts">
  import { ProgressIndicator, ProgressStep } from 'carbon-components-svelte';

  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Seo from '$lib/components/Seo.svelte';
  import { derived } from 'svelte/store';
  import { z } from 'zod';

  const ParamsSchema = z.object({
    platformId: z.string().optional(),
    gameId: z.string().optional(),
    platformGameMiniGameId: z.string().optional(),
    platformGameMiniGameModeId: z.string().optional(),
    platformGameMiniGameModeStageId: z.string().optional(),
  });
  const DataSchema = z.object({
    platform: z.object({ name: z.string() }).optional(),
    game: z.object({ name: z.string() }).optional(),
    platformGameMiniGame: z.object({ miniGameName: z.string() }).optional(),
    platformGameMiniGameMode: z.object({ modeName: z.string() }).optional(),
    platformGameMiniGameModeStage: z.object({ stageName: z.string() }).optional(),
  });

  type ParamKey = keyof z.infer<typeof ParamsSchema>;
  interface Index {
    key: ParamKey;
    index: number;
  }

  const state = derived(page, ({ data, params }) => ({
    data: DataSchema.parse(data),
    params: ParamsSchema.parse(params),
  }));

  const indexArray: readonly Index[] = [
    { key: 'platformId', index: 0 },
    { key: 'gameId', index: 1 },
    { key: 'platformGameMiniGameId', index: 2 },
    { key: 'platformGameMiniGameModeId', index: 3 },
    { key: 'platformGameMiniGameModeStageId', index: 4 },
  ];

  $: currentIndex = indexArray.find(({ key }) => !$state.params[key])?.index ?? 5;
</script>

<h1>Submit a new score</h1>

<ProgressIndicator
  {currentIndex}
  spaceEqually
  class="progress"
  preventChangeOnClick={!browser}
>
  {@const {
    params: {
      platformId,
      gameId,
      platformGameMiniGameId,
      platformGameMiniGameModeId,
      platformGameMiniGameModeStageId,
    },
    data: {
      platform,
      game,
      platformGameMiniGame,
      platformGameMiniGameMode,
      platformGameMiniGameModeStage,
    },
  } = $state}
  <ProgressStep
    label="Platform"
    secondaryLabel={platform?.name}
    complete={!!platformId}
    on:click={() => {
      goto('/b/score/submit');
    }}
  />
  <ProgressStep
    label="Game"
    secondaryLabel={game?.name}
    complete={!!gameId}
    disabled={!platformId}
    on:click={() => {
      goto(`/b/score/submit/p/${platformId}`);
    }}
  />
  <ProgressStep
    label="Mini game"
    secondaryLabel={platformGameMiniGame?.miniGameName}
    complete={!!platformGameMiniGameId}
    disabled={!gameId}
    on:click={() => {
      goto(`/b/score/submit/p/${platformId}/g/${gameId}`);
    }}
  />
  <ProgressStep
    label="Mode"
    secondaryLabel={platformGameMiniGameMode?.modeName}
    complete={!!platformGameMiniGameModeId}
    disabled={!platformGameMiniGameId}
    on:click={() => {
      goto(`/b/score/submit/p/${platformId}/g/${gameId}/mg/${platformGameMiniGameId}`);
    }}
  />
  <ProgressStep
    label="Stage"
    secondaryLabel={platformGameMiniGameModeStage?.stageName}
    complete={!!platformGameMiniGameModeStageId}
    disabled={!platformGameMiniGameModeId}
    on:click={() => {
      goto(
        `/b/score/submit/p/${platformId}/g/${gameId}/mg/${platformGameMiniGameId}/m/${platformGameMiniGameModeId}`
      );
    }}
  />
  <ProgressStep label="Score" disabled={!platformGameMiniGameModeStageId} />
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

  main :global(h2) {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
</style>
