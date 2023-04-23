<script lang="ts">
  import type { PageData } from './$types';
  import Seo from '$lib/components/Seo.svelte';

  export let data: PageData;
</script>

<Seo title="B.A.C.P." description="Biomercs Admin Controle Panel" />

<h1 class="mb-2">{data.player.name}, welcome to the B.A.C.P.</h1>

<p class="mb-2">Please use the menu on the left to start modifying the master data</p>
<p>You can follow some statistics below</p>

// TODO

<style>
  .mb-2 {
    margin-bottom: 2rem;
  }
</style>
