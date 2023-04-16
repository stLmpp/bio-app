<script lang="ts">
  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

Welcome to logged area

<pre>
{JSON.stringify(data, null, 2)}
</pre>
