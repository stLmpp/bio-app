<script lang="ts">
  import {
    Button,
    DataTable,
    OverflowMenu,
    OverflowMenuItem,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from 'carbon-components-svelte';
  import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
  import type { PageData } from './$types';
  import { BehaviorSubject, debounceTime } from 'rxjs';

  export let data: PageData;

  const _term$ = new BehaviorSubject('');
  const term$ = _term$.pipe(debounceTime(400));
  let platforms: Array<PageData['platforms'][number] & { id: string }> = [];

  const headers: readonly DataTableHeader[] = [
    { key: 'platformId', value: 'ID' },
    { key: 'name', value: 'Name' },
    { key: 'shortName', value: 'Short name' },
    { key: 'menu', empty: true },
  ];

  $: {
    let _platforms = data.platforms;
    if ($term$) {
      _platforms = _platforms.filter(
        (platform) =>
          platform.name.toLowerCase().includes($term$.toLowerCase()) ||
          platform.shortName.toLowerCase().includes($term$)
      );
    }
    platforms = _platforms.map((platform) => ({
      ...platform,
      id: platform.platformId,
    }));
    if (!platforms.length) {
      platforms = [
        {
          id: '',
          name: 'No data found',
          platformId: '-',
          shortName: '-',
        },
      ];
    }
  }
</script>

<DataTable
  {headers}
  rows={platforms}
  title="Platforms"
  description="List with all Platforms registered"
>
  <svelte:fragment slot="cell" let:cell let:row>
    {#if cell.key === 'menu' && row.id}
      <OverflowMenu flipped>
        <OverflowMenuItem text="Edit" href="/a/platform/{row.platformId}/edit" />
      </OverflowMenu>
    {:else}
      {cell.value ?? '-'}
    {/if}
  </svelte:fragment>

  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch bind:value={$_term$} />
      <Button href="/a/platform/add">Create Platform</Button>
    </ToolbarContent>
  </Toolbar>
</DataTable>
