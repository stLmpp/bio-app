<script lang="ts">
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import { Button, RadioTile, TileGroup } from 'carbon-components-svelte';
  import { ChevronLeft, ChevronRight } from 'carbon-icons-svelte';

  export let data;
  export let form;

  let platformGameMiniGameModeIdSelected =
    browser || !data.miniGames.length
      ? data.platformGameMiniGameModes[0].platformGameMiniGameModeId
      : undefined;

  let nextButtonProps: { type?: string; href?: string; disabled?: boolean } = {};
  $: {
    nextButtonProps = {
      type: browser ? 'button' : 'submit',
      disabled: browser && !platformGameMiniGameModeIdSelected,
    };
    if (browser && platformGameMiniGameModeIdSelected) {
      nextButtonProps.href = `/b/score/submit/p/${data.platform.platformId}/g/${data.game.gameId}/mg/${data.platformGameMiniGame.platformGameMiniGameId}/m/${platformGameMiniGameModeIdSelected}`;
    }
  }
</script>

<h2>Select the mode</h2>

<form method="POST" use:enhance>
  <TileGroup bind:selected={platformGameMiniGameModeIdSelected}>
    {#each data.platformGameMiniGameModes as mode (mode.modeName)}
      <div class="radio-tile">
        <RadioTile
          value={mode.platformGameMiniGameModeId}
          name="platformGameMiniGameModeId"
        >
          {mode.modeName}
        </RadioTile>
      </div>
    {/each}
  </TileGroup>

  {#if form?.error}
    <p class="form-error">{form.error.message}</p>
  {/if}

  <Button
    icon={ChevronLeft}
    href="/b/score/submit/p/{data.platform.platformId}/g/{data.game.gameId}"
    type="button"
    iconDescription="Previous"
  />
  <Button icon={ChevronRight} {...nextButtonProps}>Next</Button>
</form>
