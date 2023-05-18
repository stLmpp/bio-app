<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import {
    Grid,
    Row,
    Column,
    RadioButtonGroup,
    RadioButton,
    Checkbox,
  } from 'carbon-components-svelte';
  import type { PageData } from './$types';
  import { arrayUniqBy } from '$lib/array-uniq-by';
  import { v4 } from 'uuid';
  import { httpClient } from '$lib/http-client';
  import { z } from 'zod';

  export let data: PageData;

  let platformIdSelected = data.platforms[0]?.platformId;
  let gameIdSelected = data.games[0]?.gameId;
  let requestCount = 0;

  function setLoading(loading: boolean) {
    if (loading) {
      requestCount++;
    } else {
      requestCount = Math.max(requestCount - 1, 0);
    }
  }

  $: miniGames = arrayUniqBy(
    data.gameMiniGames.filter((gameMiniGame) => gameMiniGame.gameId === gameIdSelected),
    (item) => item.miniGameId
  ).map((miniGame) => {
    const platformGameMiniGame = data.platformGameMiniGames.find(
      (_platformGameMiniGame) =>
        _platformGameMiniGame.gameMiniGameId === miniGame.gameMiniGameId &&
        _platformGameMiniGame.platformId === platformIdSelected
    );
    return {
      miniGameId: miniGame.miniGameId,
      name: miniGame.miniGameName,
      gameMiniGameId: miniGame.gameMiniGameId,
      platformGameMiniGameId: platformGameMiniGame?.platformGameMiniGameId,
    };
  });

  async function onChange(
    miniGameId: string,
    gameMiniGameId: string,
    platformGameMiniGameId: string | undefined
  ) {
    setLoading(true);
    if (platformGameMiniGameId) {
      await onUncheck(platformGameMiniGameId);
    } else {
      await onCheck(miniGameId, gameMiniGameId);
    }
    setLoading(false);
  }

  async function onCheck(miniGameId: string, gameMiniGameId: string) {
    const fakeId = v4();
    data.platformGameMiniGames = [
      ...data.platformGameMiniGames,
      {
        gameId: gameIdSelected,
        gameMiniGameId,
        miniGameId,
        platformGameMiniGameId: fakeId,
        platformId: platformIdSelected,
        gameName: '',
        miniGameName: '',
        platformName: '',
      },
    ];
    const [error, response] = await httpClient('/api/platform-game-mini-game', {
      method: 'POST',
      schema: z.object({
        platformGameMiniGame: z.object({
          platformId: z.string(),
          gameMiniGameId: z.string(),
          platformGameMiniGameId: z.string(),
        }),
      }),
      body: {
        platformId: platformIdSelected,
        gameMiniGameId,
      },
    });
    if (error) {
      data.platformGameMiniGames = data.platformGameMiniGames.filter(
        (platformGameMiniGame) => platformGameMiniGame.platformGameMiniGameId !== fakeId
      );
      return;
    }
    data.platformGameMiniGames = data.platformGameMiniGames.map(
      (platformGameMiniGame) => {
        if (platformGameMiniGame.platformGameMiniGameId === fakeId) {
          platformGameMiniGame = {
            ...platformGameMiniGame,
            ...response.platformGameMiniGame,
          };
        }
        return platformGameMiniGame;
      }
    );
  }

  async function onUncheck(platformGameMiniGameId: string) {
    const platformGameMiniGame = data.platformGameMiniGames.find(
      (_platformGameMiniGame) =>
        _platformGameMiniGame.platformGameMiniGameId === platformGameMiniGameId
    );
    if (!platformGameMiniGame) {
      console.warn(
        `Could not find platform game mini game with id ${platformGameMiniGameId}`
      );
      return;
    }
    data.platformGameMiniGames = data.platformGameMiniGames.filter(
      (_platformGameMiniGame) =>
        _platformGameMiniGame.platformGameMiniGameId !== platformGameMiniGameId
    );
    const [error] = await httpClient(
      `/api/platform-game-mini-game/${platformGameMiniGameId}`,
      {
        method: 'DELETE',
        schema: z.void(),
      }
    );
    if (error) {
      data.platformGameMiniGames = [...data.platformGameMiniGames, platformGameMiniGame];
    }
  }
</script>

<Seo
  title="Link Platform to Game mini game"
  description="Admin page to link Platform to Game mini game"
/>

{#if !data.platforms.length}
  No platforms were found! Please add one <a href="/a/platform/add">here</a>
{:else if !data.gameMiniGames.length}
  No game mini games were found! Please add one <a href="/a/game-mini-game/link">here</a>
{:else}
  <Grid>
    <Row>
      <Column>
        <RadioButtonGroup
          orientation="vertical"
          bind:selected={platformIdSelected}
          disabled={!!requestCount}
        >
          {#each data.platforms as platform (platform.platformId)}
            <RadioButton labelText={platform.name} value={platform.platformId} />
          {/each}
        </RadioButtonGroup>
      </Column>
      <Column>
        <RadioButtonGroup
          orientation="vertical"
          bind:selected={gameIdSelected}
          disabled={!!requestCount}
        >
          {#each data.games as game (game.gameId)}
            <RadioButton labelText={game.name} value={game.gameId} />
          {/each}
        </RadioButtonGroup>
      </Column>
      <Column>
        {#each miniGames as miniGame (miniGame.miniGameId)}
          <Checkbox
            labelText={miniGame.name}
            checked={!!miniGame.platformGameMiniGameId}
            on:change={() =>
              onChange(
                miniGame.miniGameId,
                miniGame.gameMiniGameId,
                miniGame.platformGameMiniGameId
              )}
          />
        {/each}
      </Column>
    </Row>
  </Grid>
{/if}
