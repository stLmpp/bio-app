<script lang="ts">
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import { Button, RadioTile, TileGroup } from 'carbon-components-svelte';
  import { ChevronRight } from 'carbon-icons-svelte';

  export let data;
  export let form;

  let platformIdSelected =
    browser || !data.platforms.length ? data.platforms[0].platformId : undefined;

  let nextButtonProps: { type?: string; href?: string; disabled?: boolean } = {};

  $: {
    nextButtonProps = {
      type: browser ? 'button' : 'submit',
      disabled: browser && !platformIdSelected,
    };
    if (browser && platformIdSelected) {
      nextButtonProps.href = `/b/score/submit/p/${platformIdSelected}`;
    }
  }
</script>

<h2>Select the platform</h2>

<form method="POST" use:enhance>
  <TileGroup bind:selected={platformIdSelected}>
    {#each data.platforms as platform (platform.platformId)}
      <div class="radio-tile">
        <RadioTile value={platform.platformId} name="platformId">
          {platform.name}
        </RadioTile>
      </div>
    {/each}
  </TileGroup>

  {#if form?.error}
    <p class="form-error">{form.error.message}</p>
  {/if}

  <Button icon={ChevronRight} {...nextButtonProps}>Next</Button>
</form>
