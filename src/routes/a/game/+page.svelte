<script lang="ts">
  import AdminMasterDataList from '$lib/components/AdminMasterDataList.svelte';
  import { httpClient } from '$lib/http-client';
  import { z } from 'zod';
  import type { PageData } from './$types';

  export let data: PageData;
  async function deleteGame(gameId: string) {
    const oldGame = data.games.find((game) => game.gameId === gameId);
    if (!oldGame) {
      console.warn(`Could not find game with id ${gameId}`);
      return;
    }
    data.games = data.games.filter((game) => game.gameId !== gameId);
    const [error] = await httpClient(`/api/game/${gameId}`, {
      schema: z.void(),
      method: 'DELETE',
    });
    if (error) {
      data.games = [...data.games, oldGame];
    }
  }
</script>

<AdminMasterDataList
  data={data.games}
  idKey="gameId"
  headers={[
    { key: 'gameId', value: 'ID' },
    { key: 'name', value: 'Name' },
    { key: 'shortName', value: 'Short name' },
  ]}
  title="Games"
  description="All games"
  addHref="/a/game/add"
  editHref={(game) => `/a/game/${game.gameId}/edit`}
  filterKeys={['name', 'shortName']}
  on:delete={(event) => deleteGame(event.detail)}
/>
