<script lang="ts">
  import { enhance } from '$app/forms';
  import Seo from '$lib/components/Seo.svelte';
  import { formGroup } from '$lib/form-group';
  import { Alert, Anchor, Button, Text, TextInput } from '@svelteuidev/core';
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

  let passwordHidden = true; // TODO implement this
</script>

<Seo title="Login" description="Login to Biomercs and have access to all leaderboards" />

{#if $flash}
  <Alert
    title="Success"
    color="green"
    override={{ mb: '$12' }}
    withCloseButton
    closeButtonLabel="Close success alert"
    on:close={() => ($flash = null)}
  >
    Registered succesfully! Please login now to access the app
  </Alert>
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
      label="Username or e-mail"
      name="usernameOrEmail"
      autocomplete="email"
      required
      minlength={usernameOrEmailMinLength}
      error={!!$errors.usernameOrEmail && $errors.usernameOrEmail}
      bind:value={$usernameOrEmail}
    />
    <TextInput
      id="password"
      label="Password"
      name="password"
      required
      type={passwordHidden ? 'password' : 'text'}
      minlength={passwordMinLength}
      bind:value={$password}
      error={!!$errors.password && $errors.password}
    />
  </div>
  {#if form}
    <Text override={{ mt: '$8' }} align="center" color="red">
      {form.error.message}
    </Text>
  {/if}
  <div class="form-actions">
    <Button {loading} type="submit">Login</Button>
    <Anchor href="/register">Register</Anchor>
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
