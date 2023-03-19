<script lang="ts">
  import { enhance } from '$app/forms';
  import Seo from '$lib/components/Seo.svelte';
  import { formGroup } from '$lib/form-group';
  import { toSelectOptions } from '$lib/to-select-options';
  import {
    ActionIcon,
    Anchor,
    Button,
    NativeSelect,
    Text,
    TextInput,
  } from '@svelteuidev/core';
  import { z } from 'zod';
  import type { ActionData, PageData } from './$types';
  import { EyeOpen, EyeNone } from 'radix-icons-svelte';

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

  let passwordHidden = true;
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
      label="Username"
      name="username"
      autocomplete="username"
      required
      minlength={usernameMinLength}
      maxlength={usernameMaxLength}
      error={!!$errors.username && $errors.username}
      bind:value={$username}
    />
    <TextInput
      id="email"
      label="E-mail"
      name="email"
      autocomplete="email"
      required
      maxlength={emailMaxLength}
      error={!!$errors.email && $errors.email}
      bind:value={$email}
    />
    <TextInput
      id="password"
      label="Password"
      name="password"
      autocomplete="password"
      type={passwordHidden ? 'password' : 'text'}
      required
      minlength={passwordMinLength}
      error={!!$errors.password && $errors.password}
      bind:value={$password}
    >
      <ActionIcon
        slot="rightSection"
        type="button"
        on:click={() => (passwordHidden = !passwordHidden)}
      >
        {#if passwordHidden}
          <EyeNone />
        {:else}
          <EyeOpen />
        {/if}
      </ActionIcon>
    </TextInput>
    <NativeSelect
      data={toSelectOptions(data.regions, {
        value: (item) => item.id,
        label: (item) => item.name,
      })}
      bind:value={$regionId}
      label="Region"
      id="regionId"
      name="regionId"
    />
  </div>
  {#if form}
    <Text override={{ mt: '$8' }} align="center" color="red">
      {form.error.message}
    </Text>
  {/if}
  <div class="form-actions">
    <Button {loading} type="submit">Register</Button>
    <Anchor href="/">Login</Anchor>
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
