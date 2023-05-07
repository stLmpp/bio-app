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

  let platformGameMiniGameIdSelected =
    browser || !data.miniGames.length
      ? data.miniGames[0].platformGameMiniGameId
      : undefined;

  let nextButtonProps: { type?: string; href?: string } = {};
  $: {
    nextButtonProps = {
      type: browser ? 'button' : 'submit',
    };
    if (browser && platformGameMiniGameIdSelected) {
      nextButtonProps.href = `/b/score/submit/p/${data.platform.platformId}/g/${data.game.gameId}/mg/${platformGameMiniGameIdSelected}`;
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
  </StructuredListBody>
</StructuredList>

<h3>Select the mini game</h3>

<form method="POST" use:enhance>
  <TileGroup bind:selected={platformGameMiniGameIdSelected}>
    {#each data.miniGames as miniGame (miniGame.miniGameId)}
      <div class="radio-tile">
        <RadioTile value={miniGame.platformGameMiniGameId} name="platformGameMiniGameId">
          {miniGame.miniGameName}
        </RadioTile>
      </div>
    {/each}
  </TileGroup>

  {#if form?.error}
    <p class="form-error">{form.error.message}</p>
  {/if}

  <Button
    icon={ChevronLeft}
    href="/b/score/submit/p/{data.platform.platformId}"
    type="button"
    iconDescription="Previous"
  />
  <Button
    icon={ChevronRight}
    {...nextButtonProps}
    disabled={browser && !platformGameMiniGameIdSelected}
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
