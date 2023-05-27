<script lang="ts">
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import { Button, RadioTile, TileGroup } from 'carbon-components-svelte';
  import { ChevronLeft, ChevronRight } from 'carbon-icons-svelte';

  export let data;
  export let form;

  let platformGameMiniGameModeStageIdSelected =
    browser || !data.miniGames.length
      ? data.platformGameMiniGameModeStages[0].platformGameMiniGameModeStageId
      : undefined;

  let nextButtonProps: { type?: string; href?: string; disabled?: boolean } = {};
  $: {
    nextButtonProps = {
      type: browser ? 'button' : 'submit',
      disabled: browser && !platformGameMiniGameModeStageIdSelected,
    };
    if (browser && platformGameMiniGameModeStageIdSelected) {
      const { platform, game, platformGameMiniGame, platformGameMiniGameMode } = data;
      nextButtonProps.href = `/b/score/submit/p/${platform.platformId}/g/${game.gameId}/mg/${platformGameMiniGame.platformGameMiniGameId}/m/${platformGameMiniGameMode.platformGameMiniGameModeId}/s/${platformGameMiniGameModeStageIdSelected}`;
    }
  }
</script>

<h2>Select the stage</h2>

<form method="POST" use:enhance>
  <TileGroup bind:selected={platformGameMiniGameModeStageIdSelected}>
    {#each data.platformGameMiniGameModeStages as stage (stage.stageName)}
      <div class="radio-tile">
        <RadioTile
          value={stage.platformGameMiniGameModeStageId}
          name="platformGameMiniGameModeStageId"
        >
          {stage.stageName}
        </RadioTile>
      </div>
    {/each}
  </TileGroup>

  {#if form?.error}
    <p class="form-error">{form.error.message}</p>
  {/if}

  <Button
    icon={ChevronLeft}
    href="/b/score/submit/p/{data.platform.platformId}/g/{data.game.gameId}/mg/{data
      .platformGameMiniGame.platformGameMiniGameId}"
    type="button"
    iconDescription="Previous"
  />
  <Button icon={ChevronRight} {...nextButtonProps}>Next</Button>
</form>
