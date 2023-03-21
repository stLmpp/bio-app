<script lang="ts">
  import { enhance } from '$app/forms';
  import Seo from '$lib/components/Seo.svelte';
  import { formGroup } from '$lib/form-group';
  import {
    Button,
    PasswordInput,
    Select,
    SelectItem,
    TextInput,
  } from 'carbon-components-svelte';
  import { z } from 'zod';
  import type { ActionData, PageData } from './$types';

  export let form: ActionData;
  export let data: PageData;

  let loading = false;

  const usernameMinLength = 3;
  const usernameMaxLength = 50;
  const emailMaxLength = 254;
  const passwordMinLength = 6;

  const [{ username, email, password, regionId }, { errors, valid, showAllErrors }] =
    formGroup(
      {
        username: z
          .string()
          .nonempty('Username is required')
          .min(usernameMinLength, `Must contain at least ${usernameMinLength} characters`)
          .max(usernameMaxLength),
        password: z
          .string()
          .nonempty('Password is required')
          .min(passwordMinLength, `Must contain at least ${passwordMinLength} characters`)
          .regex(/\d/, 'Must contain at least 1 number')
          .regex(/[a-z]/, 'Must contain at least 1 lowercase letter')
          .regex(/[A-Z]/, 'Must contain at least 1 uppsercase letter'),
        email: z.string().nonempty('E-mail is required').email().max(emailMaxLength),
        regionId: z.string().max(20).optional(),
      },
      {
        email: '',
        password: '',
        username: '',
        regionId: 'UNKNOWN',
      }
    );

  $: console.log({ regionId: $regionId });
</script>

<Seo
  title="Register"
  description="Register to Biomercs and have access to all leaderboards"
/>

<form
  method="POST"
  use:enhance={({ cancel }) => {
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
      id="username"
      labelText="Username"
      placeholder="Username"
      name="username"
      autocomplete="username"
      required
      minlength={usernameMinLength}
      maxlength={usernameMaxLength}
      invalid={!!$errors.username}
      invalidText={$errors.username}
      bind:value={$username}
    />
    <TextInput
      id="email"
      labelText="E-mail"
      placeholder="E-mail"
      name="email"
      autocomplete="email"
      required
      maxlength={emailMaxLength}
      invalid={!!$errors.email}
      invalidText={$errors.email}
      bind:value={$email}
    />
    <PasswordInput
      id="password"
      labelText="Password"
      placeholder="Password"
      name="password"
      autocomplete="password"
      required
      minlength={passwordMinLength}
      invalid={!!$errors.password}
      invalidText={$errors.password}
      bind:value={$password}
    />
    <Select name="regionId" id="regionId" labelText="Region" bind:selected={$regionId}>
      {#each data.regions as region (region.id)}
        <SelectItem text={region.name} value={region.id} />
      {/each}
    </Select>
  </div>
  {#if form}
    {form.error.message}
  {/if}
  <div class="form-actions">
    <Button disabled={loading} type="submit">Register</Button>
    <Button href="/">Login</Button>
  </div>
</form>

<style lang="scss">
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
</style>
