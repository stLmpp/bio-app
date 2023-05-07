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
  let gameIdSelected = data.platformGameMiniGames[0]?.gameId;
  let miniGameIdSelected = data.platformGameMiniGames[0]?.miniGameId;
  let requestCount = 0;

  function setLoading(loading: boolean) {
    if (loading) {
      requestCount++;
    } else {
      requestCount = Math.max(requestCount - 1, 0);
    }
  }

  $: games = arrayUniqBy(
    data.platformGameMiniGames.filter(
      (platformGameMiniGame) => platformGameMiniGame.platformId === platformIdSelected
    ),
    (item) => item.gameId
  );
  $: miniGames = arrayUniqBy(
    data.platformGameMiniGames.filter(
      (platformGameMiniGame) =>
        platformGameMiniGame.platformId === platformIdSelected &&
        platformGameMiniGame.gameId === gameIdSelected
    ),
    (item) => item.miniGameId
  );
  $: modes = data.modes.map((mode) => {
    const platformGameMiniGameMode = data.platformGameMiniGameModes.find(
      (_platformGameMiniGameMode) =>
        _platformGameMiniGameMode.platformId === platformIdSelected &&
        _platformGameMiniGameMode.gameId === gameIdSelected &&
        _platformGameMiniGameMode.miniGameId === miniGameIdSelected &&
        _platformGameMiniGameMode.modeId === mode.modeId
    );
    return {
      ...mode,
      platformGameMiniGameModeId: platformGameMiniGameMode?.platformGameMiniGameModeId,
    };
  });

  async function onChange(
    modeId: string,
    platformGameMiniGameModeId: string | undefined
  ) {
    setLoading(true);
    if (platformGameMiniGameModeId) {
      await onUncheck(platformGameMiniGameModeId);
    } else {
      await onCheck(modeId);
    }
    setLoading(false);
  }

  async function onCheck(modeId: string) {
    const platformGameMiniGame = data.platformGameMiniGames.find(
      (_platformGameMiniGame) =>
        _platformGameMiniGame.platformId === platformIdSelected &&
        _platformGameMiniGame.gameId === gameIdSelected &&
        _platformGameMiniGame.miniGameId === miniGameIdSelected
    );
    if (!platformGameMiniGame) {
      console.warn(`Could not find platform game mini game`);
      return;
    }
    const fakeId = v4();
    data.platformGameMiniGameModes = [
      ...data.platformGameMiniGameModes,
      {
        gameId: gameIdSelected,
        gameMiniGameId: miniGameIdSelected,
        gameName: '',
        miniGameId: miniGameIdSelected,
        miniGameName: '',
        modeId,
        modeName: '',
        platformGameMiniGameId: platformGameMiniGame.platformGameMiniGameId,
        platformGameMiniGameModeId: fakeId,
        platformId: platformIdSelected,
        platformName: '',
      },
    ];
    const [error, response] = await httpClient('/api/platform-game-mini-game-mode', {
      method: 'POST',
      schema: z.object({
        platformGameMiniGameMode: z.object({
          modeId: z.string(),
          platformGameMiniGameId: z.string(),
          platformGameMiniGameModeId: z.string(),
        }),
      }),
      body: {
        modeId,
        platformGameMiniGameId: platformGameMiniGame.platformGameMiniGameId,
      },
    });
    if (error) {
      data.platformGameMiniGameModes = data.platformGameMiniGameModes.filter(
        (platformGameMiniGameMode) =>
          platformGameMiniGameMode.platformGameMiniGameModeId !== fakeId
      );
      return;
    }
    data.platformGameMiniGameModes = data.platformGameMiniGameModes.map(
      (platformGameMiniGameMode) => {
        if (platformGameMiniGameMode.platformGameMiniGameModeId === fakeId) {
          platformGameMiniGameMode = {
            ...platformGameMiniGameMode,
            ...response.platformGameMiniGameMode,
          };
        }
        return platformGameMiniGameMode;
      }
    );
  }

  async function onUncheck(platformGameMiniGameModeId: string) {
    const platformGameMiniGameMode = data.platformGameMiniGameModes.find(
      (_platformGameMiniGameMode) =>
        _platformGameMiniGameMode.platformGameMiniGameModeId ===
        platformGameMiniGameModeId
    );
    if (!platformGameMiniGameMode) {
      console.warn(
        `Could not find platform game mini game mode with id ${platformGameMiniGameModeId}`
      );
      return;
    }
    data.platformGameMiniGameModes = data.platformGameMiniGameModes.filter(
      (_platformGameMiniGameMode) =>
        _platformGameMiniGameMode.platformGameMiniGameModeId !==
        platformGameMiniGameModeId
    );
    const [error] = await httpClient(
      `/api/platform-game-mini-game-mode/${platformGameMiniGameModeId}`,
      {
        method: 'DELETE',
        schema: z.void(),
      }
    );
    if (error) {
      data.platformGameMiniGameModes = [
        ...data.platformGameMiniGameModes,
        platformGameMiniGameMode,
      ];
    }
  }
</script>

<Seo
  title="Link Platform game mini game to Mode"
  description="Admin page to link Platform game mini game to Mode"
/>

{#if !data.modes.length}
  No platforms were found! Please add one <a href="/a/mode/add">here</a>
{:else if !data.platformGameMiniGames.length}
  No platform game mini games were found! Please add one <a
    href="/a/platform-game-mini-game/link">here</a
  >
{:else}
  <Grid>
    <Row>
      <Column>
        <RadioButtonGroup
          orientation="vertical"
          bind:selected={platformIdSelected}
          disabled={!!requestCount}
          on:change={() => {
            gameIdSelected = games[0]?.gameId;
            miniGameIdSelected = miniGames[0]?.miniGameId;
          }}
        >
          {#each data.platforms as platform (platform.platformId)}
            <RadioButton labelText={platform.platformName} value={platform.platformId} />
          {/each}
        </RadioButtonGroup>
      </Column>
      <Column>
        <RadioButtonGroup
          orientation="vertical"
          bind:selected={gameIdSelected}
          disabled={!!requestCount}
          on:change={() => {
            miniGameIdSelected = miniGames[0]?.miniGameId;
          }}
        >
          {#each games as game (game.gameId)}
            <RadioButton labelText={game.gameName} value={game.gameId} />
          {/each}
        </RadioButtonGroup>
      </Column>
      <Column>
        <RadioButtonGroup
          orientation="vertical"
          bind:selected={miniGameIdSelected}
          disabled={!!requestCount}
        >
          {#each miniGames as miniGame (miniGame.miniGameId)}
            <RadioButton labelText={miniGame.miniGameName} value={miniGame.miniGameId} />
          {/each}
        </RadioButtonGroup>
      </Column>
      <Column>
        {#each modes as mode (mode.modeId)}
          <Checkbox
            labelText={mode.name}
            checked={!!mode.platformGameMiniGameModeId}
            on:change={() => onChange(mode.modeId, mode.platformGameMiniGameModeId)}
          />
        {/each}
      </Column>
    </Row>
  </Grid>
{/if}
