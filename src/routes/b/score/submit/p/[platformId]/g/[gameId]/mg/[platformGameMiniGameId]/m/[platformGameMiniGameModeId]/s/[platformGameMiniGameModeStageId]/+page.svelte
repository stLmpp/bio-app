<script lang="ts">
  import { NumberInput, TextInput } from 'carbon-components-svelte';
  import { z } from 'zod';
  import { formGroup2 } from '$lib/form-group2.js';
  import type { ScoreInitialValue, ScoreSchema } from './schema.js';

  export let data;

  const playerNumbers = Array.from(
    { length: data.platformGameMiniGameMode.playerQuantity },
    (_, index) => index + 1
  );
  const schema: ScoreSchema = {
    description: z.string().optional(),
    maxCombo: z.number().optional(),
    platformGameMiniGameModeStageId: z.string(),
    score: z.number(),
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
    schema[platformGameMiniGameModeCharacterCostumeIdKey] = z.string();
    schema[playerIdKey] = z.string();
    schema[platformInputTypeIdKey] = z.string().optional();
    schema[bulletKillsKey] = z.number().optional();
    initialValue[hostKey] = player === 1;
    initialValue[platformGameMiniGameModeCharacterCostumeIdKey] = '';
    initialValue[playerIdKey] = '';
    initialValue[platformInputTypeIdKey] = undefined;
    initialValue[bulletKillsKey] = undefined;
  }

  const { form, errors } = formGroup2({
    schema: {
      number: z.number(),
      text: z.string().nonempty(),
    },
    initial: {
      number: 1,
      text: '123',
    },
  });
</script>

<pre>
  {JSON.stringify(
    {
      form: $form,
      errors: $errors,
    },
    null,
    2
  )}
</pre>

<NumberInput bind:value={$form.number} />
<TextInput bind:value={$form.text} />
