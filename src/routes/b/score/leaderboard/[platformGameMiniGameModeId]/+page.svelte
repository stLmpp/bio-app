<script lang="ts">
  import { DataTable, Pagination } from 'carbon-components-svelte';

  export let data;

  $: rows = data.leaderboard.players.map((player) => ({
    ...player,
    id: player.playerId,
  }));

  $: stages = data.leaderboard.stages;
</script>

<a href="/b/score/leaderboard/2?p=1">Page 1</a>
<a href="/b/score/leaderboard/2?p=2">Page 2</a>

<DataTable
  headers={[
    { key: 'position', value: '#' },
    { key: 'playerName', value: 'Player' },
    ...stages.map((stage, index) => ({
      key: `scores[${index}].score`,
      value: stage.stageName,
      display: (item) => new Intl.NumberFormat('pt-BR').format(item),
    })),
    {
      key: 'total',
      value: 'Total',
      display: (item) => new Intl.NumberFormat('pt-BR').format(item),
    },
  ]}
  {rows}
  pageSize={10}
  page={1}
/>
<Pagination pageSize={10} page={1} totalItems={rows.length} pageSizeInputDisabled />
