<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { enhanceForm } from '$lib/enhance-form';
  import { formGroup } from '$lib/form-group/form-group';
  import {
    Button,
    PasswordInput,
    Select,
    SelectItem,
    TextInput,
  } from 'carbon-components-svelte';
  import { RequestQuote } from 'carbon-icons-svelte';
  import { z } from 'zod';
  import type { ActionData, PageData } from './$types';

  export let form: ActionData;
  export let data: PageData;

  let loading = false;

  const usernameMinLength = 3;
  const passwordMinLength = 6;
  const passwordPattern = '[A-Za-z\\d]{6,}';

  const { f, allValid, showAllErrors, constraints, errors, valid } = formGroup({
    schema: {
      username: z
        .string()
        .nonempty('Username is required')
        .min(usernameMinLength, `Must contain at least ${usernameMinLength} characters`)
        .max(50),
      password: z
        .string()
        .nonempty('Password is required')
        .min(passwordMinLength, `Must contain at least ${passwordMinLength} characters`)
        .regex(/\d/, 'Must contain at least 1 number')
        .regex(/[a-z]/, 'Must contain at least 1 lowercase letter')
        .regex(/[A-Z]/, 'Must contain at least 1 uppsercase letter'),
      email: z.string().nonempty('E-mail is required').email().max(254),
      regionId: z.number().optional(),
    },
    initial: {
      email: '',
      password: '',
      username: '',
      regionId: -1,
    },
  });
</script>

<Seo
  title="Register"
  description="Register to Biomercs and have access to all leaderboards"
/>

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
      labelText="Username"
      placeholder="Username"
      autocomplete="username"
      {...constraints.username}
      invalid={!$valid.username}
      invalidText={$errors.username}
      bind:value={$f.username}
    />
    <TextInput
      labelText="E-mail"
      placeholder="E-mail"
      autocomplete="email"
      {...constraints.email}
      invalid={!$valid.email}
      invalidText={$errors.email}
      bind:value={$f.email}
    />
    <PasswordInput
      labelText="Password"
      placeholder="Password"
      autocomplete="password"
      {...constraints.password}
      pattern={passwordPattern}
      invalid={!$valid.password}
      invalidText={$errors.password}
      helperText="Password must contain at least {passwordMinLength} characters, 1 lowercase letter, 1 uppercase letter and 1 number"
      bind:value={$f.password}
    />
    <Select labelText="Region" bind:selected={$f.regionId} {...constraints.regionId}>
      {#each data.regions as region (region.regionId)}
        <SelectItem text={region.name} value={region.regionId} />
      {/each}
    </Select>
  </div>
  {#if form}
    <p class="form-error">{form.error.message}</p>
  {/if}
  <div class="form-actions">
    <Button disabled={loading} type="submit" icon={RequestQuote}>Register</Button>
    <Button href="/" kind="ghost">Login</Button>
  </div>
</form>

<style lang="scss">
  @use 'carbon-components/scss/globals/scss/vars' as var;

  .fields {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }

  .form-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    column-gap: 1rem;
  }

  .form-error {
    color: var.$red-40;
    margin-top: 1rem;
    text-align: center;
  }
</style>
