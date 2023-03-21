<script lang="ts">
  import { enhance } from '$app/forms';
  import Seo from '$lib/components/Seo.svelte';
  import { formGroup } from '$lib/form-group';
  import {
    TextInput,
    PasswordInput,
    Button,
    ToastNotification,
    InlineNotification,
  } from 'carbon-components-svelte';
  import { z } from 'zod';
  import type { ActionData } from './$types';
  import { initFlash } from 'sveltekit-flash-message/client';
  import { page } from '$app/stores';

  const flash = initFlash(page);

  export let form: ActionData;

  const usernameOrEmailMinLength = 3;
  const passwordMinLength = 6;
  let loading = false;
  const [{ password, usernameOrEmail }, { valid, errors, showAllErrors }] = formGroup(
    {
      usernameOrEmail: z
        .string()
        .nonempty('Username or e-mail is required')
        .min(usernameOrEmailMinLength, 'Must contain at least 3 characters'),
      password: z
        .string()
        .nonempty('Password is required')
        .min(passwordMinLength, 'Must contain at least 6 characters'),
    },
    { usernameOrEmail: '', password: '' }
  );
</script>

<Seo title="Login" description="Login to Biomercs and have access to all leaderboards" />

{#if $flash}
  <InlineNotification
    lowContrast
    kind="success"
    title="Success!"
    subtitle="Registered succesfully! Please login now to access the app"
  />
{/if}

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
      id="usernameOrEmail"
      labelText="Username or e-mail"
      placeholder="Username or e-mail"
      name="usernameOrEmail"
      autocomplete="email"
      required
      minlength={usernameOrEmailMinLength}
      invalid={!!$errors.usernameOrEmail}
      invalidText={$errors.usernameOrEmail}
      bind:value={$usernameOrEmail}
    />
    <PasswordInput
      id="password"
      labelText="Password"
      placeholder="Password"
      name="password"
      required
      minlength={passwordMinLength}
      bind:value={$password}
      invalid={!!$errors.password}
      invalidText={$errors.password}
    />
  </div>
  {#if form}
    {form.error.message}
  {/if}
  <div class="form-actions">
    <Button type="submit" disabled={loading}>Login</Button>
    <Button href="/register">Register</Button>
  </div>
</form>

<style lang="scss">
  .fields {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
  }

  .form-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    column-gap: 1rem;
  }
</style>
