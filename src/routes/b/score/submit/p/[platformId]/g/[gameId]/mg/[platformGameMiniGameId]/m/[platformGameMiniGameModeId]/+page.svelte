<script lang="ts">
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import {
    Button,
    RadioTile,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListRow,
    TileGroup,
  } from 'carbon-components-svelte';
  import { ChevronLeft, ChevronRight } from 'carbon-icons-svelte';

  export let data;
  export let form;

  let platformGameMiniGameModeStageIdSelected =
    browser || !data.miniGames.length
      ? data.platformGameMiniGameModeStages[0].platformGameMiniGameModeStageId
      : undefined;

  let nextButtonProps: { type?: string; href?: string } = {};
  $: {
    nextButtonProps = {
      type: browser ? 'button' : 'submit',
    };
    if (browser && platformGameMiniGameModeStageIdSelected) {
      const { platform, game, platformGameMiniGame, platformGameMiniGameMode } = data;
      nextButtonProps.href = `/b/score/submit/p/${platform.platformId}/g/${game.gameId}/mg/${platformGameMiniGame.platformGameMiniGameId}/m/${platformGameMiniGameMode.platformGameMiniGameModeId}/s/${platformGameMiniGameModeStageIdSelected}`;
    }
  }
</script>

<h2>Parameters selected</h2>

<StructuredList condensed class="no-margin-bottom">
  <StructuredListBody>
    <StructuredListRow>
      <StructuredListCell>Platform</StructuredListCell>
      <StructuredListCell>{data.platform.name}</StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell>Game</StructuredListCell>
      <StructuredListCell>{data.game.name}</StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell>Mini game</StructuredListCell>
      <StructuredListCell>{data.platformGameMiniGame.miniGameName}</StructuredListCell>
    </StructuredListRow>
    <StructuredListRow>
      <StructuredListCell>Mode</StructuredListCell>
      <StructuredListCell>{data.platformGameMiniGameMode.modeName}</StructuredListCell>
    </StructuredListRow>
  </StructuredListBody>
</StructuredList>

<h3>Select the stage</h3>

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
  <Button
    icon={ChevronRight}
    {...nextButtonProps}
    disabled={browser && !platformGameMiniGameModeStageIdSelected}
  >
    Next
  </Button>
</form>

<style lang="scss">
  h2 {
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 2rem;
    margin-top: 1rem;
  }
</style>
