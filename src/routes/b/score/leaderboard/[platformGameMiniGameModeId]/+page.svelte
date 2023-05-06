<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { DataTable, Link, Pagination } from 'carbon-components-svelte';
  import { plural, type PluralMap } from '$lib/i18n';
  import { Trophy } from 'carbon-icons-svelte';
  import Seo from '$lib/components/Seo.svelte';

  export let data;

  $: rows = data.leaderboard.players.map((player) => ({
    ...player,
    id: player.playerId,
  }));
  $: stages = data.leaderboard.stages;

  const numberFormatter = new Intl.NumberFormat('pt-BR');
  const formatter = numberFormatter.format.bind(numberFormatter);

  function getScore(
    key: string,
    scores: (typeof data.leaderboard.players)[number]['scores']
  ) {
    const platformGameMiniGameModeStageId = key.split(':').pop()!;
    const index = data.leaderboard.stages.findIndex(
      (stage) => stage.platformGameMiniGameModeStageId === platformGameMiniGameModeStageId
    );
    return scores[index];
  }

  $: title = `[${data.leaderboard.gameShortName} ${data.leaderboard.platformShortName}] ${data.leaderboard.miniGameName} - ${data.leaderboard.modeName} Leaderboards`;
  $: metaDescription = `Leaderboard for ${data.leaderboard.gameName} ${data.leaderboard.miniGameName} ${data.leaderboard.modeName} on ${data.leaderboard.platformName}`;

  const partnerPluralMap: PluralMap = {
    '=0': null,
    '=1': 'Partner',
    other: 'Partners',
  };

  function isScoreCell(key: string): boolean {
    return key.startsWith('score');
  }
</script>

<Seo {title} description={metaDescription} />

<DataTable
  {title}
  headers={[
    { key: 'position', value: '#' },
    { key: 'playerName', value: 'Player' },
    ...stages.map((stage) => ({
      key: `score:${stage.platformGameMiniGameModeStageId}`,
      value: stage.stageName,
    })),
    {
      key: 'total',
      value: 'Total',
      display: formatter,
    },
  ]}
  {rows}
>
  <svelte:fragment slot="cell" let:cell let:row>
    {#if cell.key === 'position'}
      <div class="position position-{row.position}">
        {cell.value}
      </div>
    {:else if cell.key.startsWith('score')}
      {@const score = getScore(cell.key, row.scores)}
      {#if score}
        <div class="score">
          {#if score.worldRecordAt}
            <Trophy
              title="World Record at {new Date(score.worldRecordAt).toLocaleDateString()}"
            />
          {:else}
            &nbsp;
          {/if}
          <Link
            href="/b/score/{score.scoreId}"
            title={score.partners.length
              ? `${plural(score.partners.length, partnerPluralMap)}: ${score.partners
                  .map((partner) => partner.playerName)
                  .join(', ')}`
              : null}
          >
            {formatter(score.score)}
          </Link>
        </div>
      {:else}
        <div class="score">
          &nbsp;
          <span>0</span>
        </div>
      {/if}
    {:else if cell.key === 'playerName'}
      <Link href="/b/player/{row.playerId}">{cell.value}</Link>
    {:else}
      {cell.display ? cell.display(cell.value) : cell.value}
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="cell-header" let:header>
    {#if isScoreCell(header.key)}
      <div class="score-header">
        {header.value}
      </div>
    {:else}
      {header.value}
    {/if}
  </svelte:fragment>
</DataTable>
<Pagination
  pageSize={data.leaderboard.metadata.itemsPerPage}
  page={data.leaderboard.metadata.page}
  totalItems={data.leaderboard.metadata.totalItems}
  on:change={(event) => {
    if (event.detail.page) {
      const url = new URL($page.url);
      url.searchParams.set('p', String(event.detail.page));
      goto(url);
    }
  }}
  pageSizeInputDisabled
/>

<style lang="scss">
  .position {
    border: 2.5px solid;
    border-radius: 50%;
    padding: 0.25rem;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: transparent;
  }

  .position-1 {
    border-color: goldenrod;
  }

  .position-2 {
    border-color: silver;
  }

  .position-3 {
    border-color: rgb(205, 127, 50);
  }

  .score-header {
    text-align: end;
  }

  .score {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
