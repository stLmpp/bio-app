<script lang="ts">
  import { createEventDispatcher } from 'svelte';
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
  import { BehaviorSubject, debounceTime } from 'rxjs';

  type T = $$Generic;

  export let data: T[] = [];
  export let idKey: keyof T;
  export let headers: readonly DataTableHeader[];
  export let title: string;
  export let description: string;
  export let addHref: string;
  export let editHref: (row: T) => string;
  export let filterKeys: (keyof T)[];

  const eventDispatcher = createEventDispatcher<{ delete: T[typeof idKey] }>();

  const editHrefKey = '__editHref';

  const _term$ = new BehaviorSubject('');
  const term$ = _term$.pipe(debounceTime(400));
  let list: Array<T & { id: unknown; __editHref: string }> = [];

  $: {
    let _list = data;
    if ($term$) {
      _list = _list.filter((item) =>
        filterKeys.some((filterKey) =>
          String(item[filterKey]).toLowerCase().includes($term$.toLowerCase())
        )
      );
    }
    list = _list.map((item) => ({
      ...item,
      id: item[idKey],
      [editHrefKey]: editHref(item),
    }));
  }

  $: headers = [...headers, { key: 'menu', empty: true }];
</script>

<DataTable {headers} rows={list} {title} {description}>
  <svelte:fragment slot="cell" let:cell let:row>
    {#if cell.key === 'menu' && row.id}
      <OverflowMenu flipped>
        <OverflowMenuItem text="Edit" href={row[editHrefKey]} />
        <OverflowMenuItem
          text="Delete"
          danger
          on:click={() => eventDispatcher('delete', row.id)}
        />
      </OverflowMenu>
    {:else}
      {cell.value ?? '-'}
    {/if}
  </svelte:fragment>

  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch bind:value={$_term$} />
      <Button href={addHref}>Create</Button>
    </ToolbarContent>
  </Toolbar>
</DataTable>
