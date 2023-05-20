<script lang="ts">
  import { formGroup2 } from '$lib/form-group2.js';
  import { NumberInput, TextInput } from 'carbon-components-svelte';
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
    platformGameMiniGameModeStageId: '',
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
    initialValue[platformGameMiniGameModeCharacterCostumeIdKey] = '';
    initialValue[playerIdKey] = '';
    initialValue[platformInputTypeIdKey] = undefined;
    initialValue[bulletKillsKey] = undefined;
  }

  const { form, errors, formValid, valid, constraints } = formGroup2({
    schema,
    initial: initialValue,
  });
  $: console.log($form);
</script>

<pre>
  {JSON.stringify(
    {
      form: $form,
      errors: $errors,
      formValid: $formValid,
      valid: $valid,
      constraints,
    },
    null,
    2
  )}
</pre>

{#each playerNumbers as playerNumber}
  <h4>Player {playerNumber}</h4>
  {@const { playerIdKey } = getPlayerKeys(playerNumber)}
  <TextInput
    bind:value={$form[playerIdKey]}
    {...constraints[playerIdKey]}
    invalid={$valid[playerIdKey]}
    invalidText={$errors[playerIdKey] ?? ''}
    labelText="Player id"
    placeholder="Player id"
  />
  <div style="margin-bottom: 2rem" />
{/each}
