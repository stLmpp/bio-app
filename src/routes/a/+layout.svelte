<script lang="ts">
  import {
    Content,
    Header,
    HeaderActionLink,
    HeaderUtilities,
  } from 'carbon-components-svelte';
  import { Home } from 'carbon-icons-svelte';
</script>

<Header company="Biomercs">
  <HeaderUtilities>
    <HeaderActionLink href="/b" icon={Home} />
  </HeaderUtilities>
</Header>

<Content><slot /></Content>
