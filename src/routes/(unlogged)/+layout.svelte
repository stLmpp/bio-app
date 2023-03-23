<script lang="ts">
  import {
    Content,
    Header,
    HeaderActionLink,
    HeaderUtilities,
  } from 'carbon-components-svelte';
  import { Login, RequestQuote } from 'carbon-icons-svelte';
</script>

<Header company="Biomercs" href="/">
  <HeaderUtilities>
    <HeaderActionLink href="/login" icon={Login} aria-label="Login" />
    <HeaderActionLink href="/register" icon={RequestQuote} aria-label="Register" />
  </HeaderUtilities>
</Header>

<Content>
  <slot />
</Content>
