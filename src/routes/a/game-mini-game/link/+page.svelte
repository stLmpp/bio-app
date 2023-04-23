<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { httpClient } from '$lib/http-client';
  import {
    Checkbox,
    Column,
    Grid,
    RadioButton,
    RadioButtonGroup,
    Row,
  } from 'carbon-components-svelte';
  import { v4 } from 'uuid';
  import { z } from 'zod';
  import type { PageData } from './$types';

  export let data: PageData;

  let gameIdSelected = data.games[0]?.gameId;

  let requestCount = 0;

  function setLoading(loading: boolean) {
    if (loading) {
      requestCount++;
    } else {
      requestCount = Math.max(requestCount - 1, 0);
    }
  }

  $: miniGames = data.miniGames.map((miniGame) => {
    const gameMiniGame = data.gameMiniGames.find(
      (_gameMiniGame) =>
        _gameMiniGame.gameId === gameIdSelected &&
        _gameMiniGame.miniGameId === miniGame.miniGameId
    );
    return {
      ...miniGame,
      gameMiniGameId: gameMiniGame?.gameMiniGameId,
    };
  });

  async function onCheckboxClick(miniGameId: string, gameMiniGameId: string | undefined) {
    if (gameMiniGameId) {
      return onUncheck(gameMiniGameId);
    }
    return onCheck(miniGameId);
  }

  async function onUncheck(gameMiniGameId: string) {
    const gameMiniGame = data.gameMiniGames.find(
      (_gameMiniGame) => _gameMiniGame.gameMiniGameId === gameMiniGameId
    );
    if (!gameMiniGame) {
      // TODO logger?
      console.warn(`Game mini game with id ${gameMiniGameId} not found`);
      return;
    }
    setLoading(true);
    data.gameMiniGames = data.gameMiniGames.filter(
      (_gameMiniGame) => _gameMiniGame.gameMiniGameId !== gameMiniGameId
    );
    const [error] = await httpClient(`/api/game-mini-game/${gameMiniGameId}`, {
      method: 'DELETE',
      schema: z.void(),
    });
    setLoading(false);
    if (error) {
      data.gameMiniGames = [...data.gameMiniGames, gameMiniGame];
      return;
    }
  }

  async function onCheck(miniGameId: string) {
    setLoading(true);
    const fakeId = v4();
    data.gameMiniGames = [
      ...data.gameMiniGames,
      { gameId: gameIdSelected, miniGameId, gameMiniGameId: fakeId },
    ];
    const [error, response] = await httpClient('/api/game-mini-game', {
      method: 'POST',
      body: {
        gameId: gameIdSelected,
        miniGameId,
      },
      schema: z.object({
        gameId: z.string(),
        miniGameId: z.string(),
        gameMiniGameId: z.string(),
      }),
    });
    setLoading(false);
    if (error) {
      data.gameMiniGames = data.gameMiniGames.filter(
        (gameMiniGame) => gameMiniGame.gameMiniGameId !== fakeId
      );
      return;
    }
    data.gameMiniGames = data.gameMiniGames.map((gameMiniGame) => {
      if (gameMiniGame.gameMiniGameId === fakeId) {
        gameMiniGame = response;
      }
      return gameMiniGame;
    });
  }
</script>

<Seo title="Link Game to Mini game" description="Admin page to link Game to Mini game" />

{#if !data.games.length}
  No games were found! Please add one <a href="/a/game/add">here</a>
{:else if !data.miniGames.length}
  No mini games were found! Please add one <a href="/a/mini-game/add">here</a>
{:else}
  <Grid>
    <Row>
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
            checked={!!miniGame.gameMiniGameId}
            on:change={() =>
              onCheckboxClick(miniGame.miniGameId, miniGame.gameMiniGameId)}
          />
        {/each}
      </Column>
    </Row>
  </Grid>
{/if}
