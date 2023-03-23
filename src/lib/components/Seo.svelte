<script lang="ts">
  export let title: string | undefined = undefined;
  export let description: string;
</script>

<svelte:head>
  <title>{title ? `${title} - Biomercs` : 'Biomercs'}</title>
  <meta name="description" content={description} />
</svelte:head>
