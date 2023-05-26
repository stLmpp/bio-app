<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { enhanceForm } from '$lib/enhance-form';
  import { formGroup } from '$lib/form-group/form-group';
  import { Button, TextInput } from 'carbon-components-svelte';
  import { z } from 'zod';
  import type { ActionData } from './$types';

  export let form: ActionData;

  const NAME_MAX_LENGTH = 100;
  const SHORT_NAME_MAX_LENGTH = 10;
  let loading = false;

  const { f, constraints, errors, showAllErrors, valid, allValid } = formGroup({
    schema: {
      shortName: z.string().nonempty('Short name is required').max(SHORT_NAME_MAX_LENGTH),
      name: z.string().nonempty('Name is required').max(NAME_MAX_LENGTH),
    },
    initial: {
      name: '',
      shortName: '',
    },
  });
</script>

<Seo title="Add new Platform" description="Add a new Platform" />

<h1>Add new Platform</h1>

<form
  method="POST"
  use:enhanceForm={({ cancel }) => {
    if (!$allValid) {
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
      bind:value={$f.shortName}
      labelText="Short name"
      placeholder="Short name"
      invalid={!$valid.shortName}
      invalidText={$errors.shortName}
      helperText="{$f.shortName.length}/{SHORT_NAME_MAX_LENGTH} characters"
      {...constraints.shortName}
    />
    <TextInput
      bind:value={$f.name}
      labelText="Name"
      placeholder="Name"
      invalid={!$valid.name}
      invalidText={$errors.name}
      helperText="{$f.name.length}/{NAME_MAX_LENGTH} characters"
      {...constraints.name}
    />
  </div>
  {#if form}
    <p class="form-error">{form.error.message}</p>
  {/if}
  <div class="form-actions">
    <Button type="submit" disabled={loading}>Submit</Button>
    <Button href="/a/platform" kind="ghost">Platform list</Button>
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
