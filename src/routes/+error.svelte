<script lang="ts">
  import { page } from '$app/stores';
</script>

<h1>Internal error</h1>
<h3>Please don't panic, send a report here: // TODO link to support</h3>

{#if $page.error}
  <h4>Details</h4>
  <p>Status: {$page.error.status}</p>
  <p>Message: {$page.error.message}</p>
  <p>Error code: {$page.error.errorCode}</p>
  <p>Error: {$page.error.error}</p>
{/if}
