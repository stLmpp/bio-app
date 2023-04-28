<script lang="ts">
  import { formGroup } from '$lib/form-group';
  import { Button, TextInput } from 'carbon-components-svelte';
  import { z } from 'zod';
  import { enhanceForm } from '$lib/enhance-form';
  import type { ActionData } from './$types';
  import Seo from '$lib/components/Seo.svelte';

  export let form: ActionData;

  const NAME_MAX_LENGTH = 100;
  const SHORT_NAME_MAX_LENGTH = 10;
  let loading = false;

  const [{ name, shortName }, { constraints, errors, showAllErrors, valid }] = formGroup(
    {
      shortName: z.string().nonempty('Short name is required').max(SHORT_NAME_MAX_LENGTH),
      name: z.string().nonempty('Name is required').max(NAME_MAX_LENGTH),
    },
    {
      name: '',
      shortName: '',
    }
  );

  // TODO change to edit
</script>

<Seo title="Edit Game" description="Edit Game" />

<h1>Edit Game</h1>

<form
  method="POST"
  use:enhanceForm={({ cancel }) => {
    if (!$valid.group) {
      showAllErrors();
      return cancel();
    }
    loading = true;
    return async ({ update }) => {
      await update();
      loading = false;
    };
  }}
>
  <div class="fields">
    <TextInput
      bind:value={$shortName}
      labelText="Short name"
      placeholder="Short name"
      invalid={!!$errors.shortName}
      invalidText={$errors.shortName}
      helperText="{$shortName.length}/{SHORT_NAME_MAX_LENGTH} characters"
      {...constraints.shortName}
    />
    <TextInput
      bind:value={$name}
      labelText="Name"
      placeholder="Name"
      invalid={!!$errors.name}
      invalidText={$errors.name}
      helperText="{$name.length}/{NAME_MAX_LENGTH} characters"
      {...constraints.name}
    />
  </div>
  {#if form}
    <p class="form-error">{form.error.message}</p>
  {/if}
  <div class="form-actions">
    <Button type="submit" disabled={loading}>Submit</Button>
    <Button href="/a/game" kind="ghost">Game list</Button>
  </div>
</form>

<style lang="scss">
  @use 'carbon-components/scss/globals/scss/vars' as var;
  .fields {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
  }

  .form-actions {
    display: flex;
    align-items: center;
    margin-top: 2rem;
    column-gap: 1rem;
  }

  .form-error {
    color: var.$red-40;
    margin-top: 1rem;
  }

  h1 {
    margin-bottom: 2rem;
  }
</style>
