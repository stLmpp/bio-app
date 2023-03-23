<script lang="ts">
  import { page } from '$app/stores';
  import Seo from '$lib/components/Seo.svelte';
  import { formGroup } from '$lib/form-group';
  import {
    Button,
    InlineNotification,
    PasswordInput,
    TextInput,
  } from 'carbon-components-svelte';
  import { Login } from 'carbon-icons-svelte';
  import { initFlash } from 'sveltekit-flash-message/client';
  import { z } from 'zod';
  import { enhanceForm } from '$lib/enhance-form';
  import type { ActionData } from './$types';

  const flash = initFlash(page);

  export let form: ActionData;

  const usernameOrEmailMinLength = 3;
  const passwordMinLength = 6;
  let loading = false;
  const [{ password, usernameOrEmail }, { valid, errors, showAllErrors, constraints }] =
    formGroup(
      {
        usernameOrEmail: z
          .string()
          .nonempty('Username or e-mail is required')
          .min(
            usernameOrEmailMinLength,
            `Must contain at least ${usernameOrEmailMinLength} characters`
          ),
        password: z
          .string()
          .nonempty('Password is required')
          .min(
            passwordMinLength,
            `Must contain at least ${passwordMinLength} characters`
          ),
      },
      { usernameOrEmail: $page.url.searchParams.get('username') ?? '', password: '' }
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
      id="usernameOrEmail"
      labelText="Username or e-mail"
      placeholder="Username or e-mail"
      name="usernameOrEmail"
      autocomplete="email"
      {...constraints.usernameOrEmail}
      invalid={!!$errors.usernameOrEmail}
      invalidText={$errors.usernameOrEmail}
      bind:value={$usernameOrEmail}
    />
    <PasswordInput
      id="password"
      labelText="Password"
      placeholder="Password"
      name="password"
      {...constraints.password}
      bind:value={$password}
      invalid={!!$errors.password}
      invalidText={$errors.password}
    />
  </div>
  {#if form}
    <p class="form-error">{form.error.message}</p>
  {/if}
  <div class="form-actions">
    <Button type="submit" disabled={loading} icon={Login}>Login</Button>
    <Button href="/register" kind="ghost">Register</Button>
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