<script lang="ts">
  import { Button, Select, SelectItem, TextInput } from 'carbon-components-svelte';
  import type { ActionData, PageData } from './$types';
  import { formGroup } from '$lib/form-group/form-group';
  import { z } from 'zod';
  import Seo from '$lib/components/Seo.svelte';
  import { enhanceForm } from '$lib/enhance-form';
  import { RequestQuote } from 'carbon-icons-svelte';

  export let data: PageData;
  export let form: ActionData;

  let loading = false;

  const { f, constraints, getAllValid, showAllErrors, valid, errors } = formGroup({
    schema: {
      regionId: z.number().min(-1),
      name: z.string().min(3).max(50),
      email: z.string().email().max(254),
    },
    initial: {
      email: '',
      name: data.suggestedPlayerName,
      regionId: -1,
    },
  });
</script>

<Seo title="Register with Steam" description="Steam registration after login" />

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
  <div class="gap-4 grid">
    <TextInput
      labelText="Name"
      placeholder="Name"
      autocomplete="username"
      bind:value={$f.name}
      invalid={!$valid.name}
      invalidText={$errors.name}
      helperText="This is just a suggested username, you can change it if you like"
      {...constraints.name}
    />
    <TextInput
      labelText="E-mail"
      placeholder="E-mail"
      autocomplete="email"
      bind:value={$f.email}
      invalid={!$valid.email}
      invalidText={$errors.email}
      {...constraints.email}
    />
    <Select
      labelText="Region"
      bind:selected={$f.regionId}
      helperText="Pick your region, or leave it as Unknown"
      {...constraints.regionId}
    >
      {#each data.regions as region (region.regionId)}
        <SelectItem text={region.name} value={region.regionId} />
      {/each}
    </Select>
  </div>
  {#if form}
    <p class="text-red-400 mt-4 text-center">{form.error.message}</p>
  {/if}
  <div class="flex justify-center items-center gap-x-4 mt-8">
    <Button disabled={loading} type="submit" icon={RequestQuote}>Register</Button>
    <Button href="/login" kind="ghost">Go back to login</Button>
  </div>
</form>
