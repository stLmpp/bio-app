<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

Welcome to logged area

<pre>
{JSON.stringify(data, null, 2)}
</pre>

<br />

<form method="POST" action="?/logout" use:enhance>
  <button type="submit">Logout</button>
</form>
