<script lang="ts">
  import {
    Content,
    Header,
    HeaderAction,
    HeaderActionLink,
    HeaderUtilities,
  } from 'carbon-components-svelte';
  import { Logout, UserAdmin } from 'carbon-icons-svelte';
  import { enhance } from '$app/forms';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

<Header company="Biomercs">
  <HeaderUtilities>
    {#if data.user.admin}
      <HeaderActionLink href="/a" icon={UserAdmin} />
    {/if}
    <form method="POST" action="?/logout" use:enhance>
      <HeaderAction icon={Logout} type="submit" />
    </form>
  </HeaderUtilities>
</Header>

<Content>
  <slot />
</Content>
