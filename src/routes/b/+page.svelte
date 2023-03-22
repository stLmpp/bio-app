<script lang="ts">
  import { enhance } from '$app/forms';

  export let data;
</script>

Welcome to logged area {JSON.stringify(data, null, 2)}

<br />

<form method="POST" action="?/logout" use:enhance>
  <button type="submit">Logout</button>
</form>

<a href="/a">Go to A</a>
