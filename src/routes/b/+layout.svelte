<script lang="ts">
  import {
    Content,
    Header,
    HeaderActionLink,
    HeaderUtilities,
  } from 'carbon-components-svelte';
  import { UserAdmin } from 'carbon-icons-svelte';
</script>

<Header company="Biomercs">
  <HeaderUtilities>
    <!-- TODO remove this link to admin page -->
    <HeaderActionLink href="/a" icon={UserAdmin} />
  </HeaderUtilities>
</Header>

<Content><slot /></Content>
