<script lang="ts">
  import { page } from '$app/stores';
  import Seo from '$lib/components/Seo.svelte';
  import { enhanceForm } from '$lib/enhance-form';
  import { formGroup } from '$lib/form-group/form-group';
  import {
    Button,
    InlineNotification,
    PasswordInput,
    TextInput,
  } from 'carbon-components-svelte';
  import { Login } from 'carbon-icons-svelte';
  import { initFlash } from 'sveltekit-flash-message/client';
  import { z } from 'zod';
  import type { ActionData, PageData } from './$types';

  const flash = initFlash(page);

  export let form: ActionData;
  export let data: PageData;

  const usernameOrEmailMinLength = 3;
  const passwordMinLength = 6;
  let loading = false;
  const { f, showAllErrors, valid, errors, allValid, constraints } = formGroup({
    schema: {
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
        .min(passwordMinLength, `Must contain at least ${passwordMinLength} characters`),
    },
    initial: {
      usernameOrEmail:
        form?.formData?.usernameOrEmail ?? $page.url.searchParams.get('username') ?? '',
      password: form?.formData?.password ?? '',
    },
  });
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
      labelText="Username or e-mail"
      placeholder="Username or e-mail"
      autocomplete="email"
      {...constraints.usernameOrEmail}
      invalid={!$valid.usernameOrEmail}
      invalidText={$errors.usernameOrEmail}
      bind:value={$f.usernameOrEmail}
    />
    <PasswordInput
      labelText="Password"
      placeholder="Password"
      {...constraints.password}
      bind:value={$f.password}
      invalid={!$valid.password}
      invalidText={$errors.password}
    />
  </div>
  {#if form?.error || data.operationError}
    <p class="form-error">{form?.error.message ?? data.operationError?.message}</p>
  {/if}

  <div class="form-actions">
    <Button type="submit" disabled={loading} icon={Login}>Login</Button>
    <Button href="/register" kind="ghost">Register</Button>
  </div>
  {#if data.authSteam}
    <div class="mt-4 flex justify-center">
      <a href={data.authSteam.url}>
        <img src="/steam-sign-in.png" alt="Steam sign in" width="180" height="35" />
      </a>
    </div>
  {/if}
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
