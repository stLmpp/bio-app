<script lang="ts">
  import { formGroup } from '$lib/form-group';
  import { Button, NumberInput, TextInput } from 'carbon-components-svelte';
  import { z } from 'zod';
  import { enhanceForm } from '$lib/enhance-form';
  import type { ActionData } from './$types';
  import Seo from '$lib/components/Seo.svelte';

  export let form: ActionData;

  const NAME_MAX_LENGTH = 100;
  const PLAYER_QUANTITY_MIN = 1;
  const PLAYER_QUANTITY_MAX = 100;
  let loading = false;

  const [{ name, playerQuantity }, { constraints, errors, showAllErrors, valid }] =
    formGroup(
      {
        name: z.string().nonempty('Name is required').max(NAME_MAX_LENGTH),
        playerQuantity: z
          .number({
            invalid_type_error: 'Player quantity is required',
            required_error: 'Player quantity is required',
          })
          .min(
            PLAYER_QUANTITY_MIN,
            `Player quantity must be greater than or equal to ${PLAYER_QUANTITY_MIN}`
          )
          .max(
            PLAYER_QUANTITY_MAX,
            `Player quantity must be less than or equal to ${PLAYER_QUANTITY_MAX}`
          ),
      },
      {
        name: '',
        playerQuantity: 1,
      }
    );
</script>

<Seo title="Add Mode" description="Add new Mode" />

<h1>Add new Mode</h1>

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
      bind:value={$name}
      labelText="Name"
      placeholder="Name"
      invalid={!!$errors.name}
      invalidText={$errors.name}
      helperText="{$name.length}/{NAME_MAX_LENGTH} characters"
      {...constraints.name}
    />
    <NumberInput
      bind:value={$playerQuantity}
      label="Player quantity"
      placeholder="Player quantity"
      invalid={!!$errors.playerQuantity}
      invalidText={$errors.playerQuantity}
      helperText="Min {PLAYER_QUANTITY_MIN}, Max {PLAYER_QUANTITY_MAX}"
      {...constraints.playerQuantity}
    />
  </div>
  {#if form}
    <p class="form-error">{form.error.message}</p>
  {/if}
  <div class="form-actions">
    <Button type="submit" disabled={loading}>Submit</Button>
    <Button href="/a/mode" kind="ghost">Mode list</Button>
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
