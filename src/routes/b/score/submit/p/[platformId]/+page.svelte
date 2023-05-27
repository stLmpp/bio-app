<script lang="ts">
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import { Button, RadioTile, TileGroup } from 'carbon-components-svelte';
  import { ChevronLeft, ChevronRight } from 'carbon-icons-svelte';

  export let data;
  export let form;

  let gameIdSelected = browser || !data.games.length ? data.games[0].gameId : undefined;

  let nextButtonProps: { type?: string; href?: string; disabled?: boolean } = {};
  $: {
    nextButtonProps = {
      type: browser ? 'button' : 'submit',
      disabled: browser && !gameIdSelected,
    };
    if (browser && gameIdSelected) {
      nextButtonProps.href = `/b/score/submit/p/${data.platform.platformId}/g/${gameIdSelected}`;
    }
  }
</script>

<h2>Select the game</h2>

<form method="POST" use:enhance>
  <TileGroup bind:selected={gameIdSelected}>
    {#each data.games as game (game.gameId)}
      <div class="radio-tile">
        <RadioTile value={game.gameId} name="gameId">
          {game.gameName}
        </RadioTile>
      </div>
    {/each}
  </TileGroup>

  {#if form?.error}
    <p class="form-error">{form.error.message}</p>
  {/if}

  <Button
    icon={ChevronLeft}
    href="/b/score/submit/"
    type="button"
    iconDescription="Previous"
  />
  <Button icon={ChevronRight} {...nextButtonProps}>Next</Button>
</form>
