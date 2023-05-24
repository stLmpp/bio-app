import type { PascalCase } from 'type-fest';
import type { ZodBoolean, ZodNumber, ZodOptional, ZodString, z } from 'zod';

type PlayerProperties = {
  host: ZodBoolean;
  platformGameMiniGameModeCharacterCostumeId: ZodString;
  playerId: ZodString;
  platformInputTypeId: ZodOptional<ZodString>;
  bulletKills: ZodOptional<ZodNumber>;
};

export type PlayerInitialValue = {
  [K in keyof PlayerProperties]: z.infer<PlayerProperties[K]>;
};

export type PlayerSchema = {
  [K in keyof PlayerProperties as `player${number}${PascalCase<K>}`]: PlayerProperties[K];
};

export type ScoreSchema = {
  score: ZodNumber;
  maxCombo: ZodOptional<ZodNumber>;
  time: ZodOptional<ZodString>;
  platformGameMiniGameModeStageId: ZodString;
  description: ZodOptional<ZodString>;
} & PlayerSchema;

export type ScoreInitialValue = {
  [K in keyof ScoreSchema]: z.infer<ScoreSchema[K]>;
};
