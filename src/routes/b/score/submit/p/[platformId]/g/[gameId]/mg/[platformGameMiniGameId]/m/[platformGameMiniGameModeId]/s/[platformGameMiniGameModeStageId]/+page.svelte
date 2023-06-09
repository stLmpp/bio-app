<script lang="ts">
  import { formGroup } from '$lib/form-group/form-group.js';
  import { RadioButton, Select, SelectItem, TextInput } from 'carbon-components-svelte';
  import { z } from 'zod';
  import type { ScoreInitialValue, ScoreSchema } from './schema.js';

  export let data;

  const playerNumbers = Array.from(
    { length: data.platformGameMiniGameMode.playerQuantity },
    (_, index) => index + 1
  );
  const schema: ScoreSchema = {
    description: z.string().nonempty().max(5000).optional(),
    maxCombo: z.number().positive().optional(),
    platformGameMiniGameModeStageId: z.string(),
    score: z.number().positive().safe(),
    time: z.string().optional(),
  };
  const initialValue: ScoreInitialValue = {
    platformGameMiniGameModeStageId:
      data.platformGameMiniGameModeStage.platformGameMiniGameModeStageId,
    score: 0,
    description: undefined,
    maxCombo: undefined,
    time: undefined,
  };

  function getPlayerKeys(player: number) {
    const hostKey = `player${player}Host` as const;
    const platformGameMiniGameModeCharacterCostumeIdKey =
      `player${player}PlatformGameMiniGameModeCharacterCostumeId` as const;
    const playerIdKey = `player${player}PlayerId` as const;
    const platformInputTypeIdKey = `player${player}PlatformInputTypeId` as const;
    const bulletKillsKey = `player${player}BulletKills` as const;
    return {
      hostKey,
      platformGameMiniGameModeCharacterCostumeIdKey,
      playerIdKey,
      platformInputTypeIdKey,
      bulletKillsKey,
    };
  }

  for (const player of playerNumbers) {
    const {
      hostKey,
      platformGameMiniGameModeCharacterCostumeIdKey,
      playerIdKey,
      platformInputTypeIdKey,
      bulletKillsKey,
    } = getPlayerKeys(player);
    schema[hostKey] = z.boolean();
    schema[platformGameMiniGameModeCharacterCostumeIdKey] = z.string().nonempty();
    schema[playerIdKey] = z.string().nonempty();
    schema[platformInputTypeIdKey] = z.string().optional();
    schema[bulletKillsKey] = z.number().positive().optional();
    initialValue[hostKey] = player === 1;
    initialValue[platformGameMiniGameModeCharacterCostumeIdKey] =
      data.characters[0].platformGameMiniGameModeCharacterCostumeId;
    initialValue[playerIdKey] = player === 1 ? data.player.playerId : '';
    initialValue[platformInputTypeIdKey] = undefined;
    initialValue[bulletKillsKey] = undefined;
  }

  const { f, errors, valid, constraints, update } = formGroup({
    schema,
    initial: initialValue,
  });
</script>

<pre>
  {JSON.stringify(
    {
      form: $f,
      valid: $valid,
      errors: $errors,
    },
    null,
    2
  )}
</pre>

{#each playerNumbers as playerNumber}
  <h4>Player {playerNumber}</h4>
  {@const {
    playerIdKey,
    platformGameMiniGameModeCharacterCostumeIdKey,
    bulletKillsKey,
    hostKey,
    platformInputTypeIdKey,
  } = getPlayerKeys(playerNumber)}
  <RadioButton
    bind:checked={$f[hostKey]}
    labelText="Host"
    on:change={() => {
      if ($f[hostKey]) {
        return;
      }
      update((formValue) => {
        for (const _playerNumber of playerNumbers) {
          const { hostKey: _hostKey } = getPlayerKeys(_playerNumber);
          formValue[_hostKey] = _playerNumber === playerNumber;
        }
        return formValue;
      });
    }}
  />
  <TextInput
    bind:value={$f[playerIdKey]}
    {...constraints[playerIdKey]}
    invalid={!$valid[playerIdKey]}
    invalidText={$errors[playerIdKey] ?? ''}
    labelText="Player id"
    placeholder="Player id"
    readonly={playerNumber === 1 && !data.user.admin}
  />
  <Select
    labelText="Character"
    bind:selected={$f[platformGameMiniGameModeCharacterCostumeIdKey]}
  >
    {#each data.characters as character (character.platformGameMiniGameModeCharacterCostumeId)}
      <SelectItem
        value={character.platformGameMiniGameModeCharacterCostumeId}
        text={character.characterFullName}
      />
    {/each}
  </Select>
  <div style="margin-bottom: 2rem" />
{/each}
