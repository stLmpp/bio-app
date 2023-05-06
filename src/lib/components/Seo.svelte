<script lang="ts">
  export let title: string | undefined = undefined;
  export let description: string;
  export let noRobots = false;
</script>

<svelte:head>
  <title>{title ? `${title} - Biomercs` : 'Biomercs'}</title>
  <meta name="description" content={description} />
  <meta name="robots" content={!noRobots ? 'index,follow' : 'noindex,nofollow'} />
</svelte:head>
