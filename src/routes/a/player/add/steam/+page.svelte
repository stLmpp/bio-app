<script lang="ts">
  import { formGroup } from '$lib/form-group/form-group';
  import { z } from 'zod';
  import { enhanceForm } from '$lib/enhance-form';
  import {
    Button,
    Select,
    SelectItem,
    TextInput,
    Tooltip,
  } from 'carbon-components-svelte';
  import type { ActionData, PageData } from './$types';

  export let form: ActionData;
  export let data: PageData;

  let loading = false;

  const STEAMID_MAX = 100;
  const NAME_MAX = 50;

  const { f, getAllValid, showAllErrors, constraints, valid, errors, reset } = formGroup({
    schema: {
      steamid: z.string().nonempty().max(STEAMID_MAX),
      name: z.string().max(NAME_MAX).optional(),
      regionId: z.number().default(-1),
    },
    initial: {
      steamid: '',
      name: undefined,
      regionId: -1,
    },
  });

  $: {
    if (form?.player) {
      reset();
    }
  }
</script>

<h1 class="mb-4">Create player with steam</h1>

<form
  method="POST"
  use:enhanceForm={({ cancel }) => {
    if (!getAllValid()) {
      showAllErrors();
      cancel();
      return;
    }
    loading = true;
    return async ({ update }) => {
      await update();
      loading = false;
    };
  }}
>
  <div class="grid gap-4">
    <TextInput
      labelText="Steam id"
      placeholder="Steam id"
      bind:value={$f.steamid}
      helperText="{$f.steamid.length}/{STEAMID_MAX} characters"
      invalid={!$valid.steamid}
      invalidText={$errors.steamid}
      {...constraints.steamid}
    />
    <TextInput
      labelText="Player name"
      placeholder="Player name"
      bind:value={$f.name}
      helperText="Optional name to register, the steam name will be used if this field is blank"
      invalid={!$valid.name}
      invalidText={$errors.name}
      {...constraints.name}
    />
    <Select labelText="Region" bind:selected={$f.regionId} {...constraints.regionId}>
      {#each data.regions as region (region.regionId)}
        <SelectItem text={region.name} value={region.regionId} />
      {/each}
    </Select>
  </div>
  {#if form?.error}
    <p class="text-red-500 mt-4">{form.error.message}</p>
  {/if}
  {#if form?.player}
    <p class="text-green-500 mt-4 flex">
      Player "{form.player.playerName}" created.
      <Tooltip>
        <p>Player id: {form.player.playerId}</p>
      </Tooltip>
    </p>
  {/if}
  <div class="mt-8">
    <Button type="submit" disabled={loading}>Submit</Button>
  </div>
</form>
