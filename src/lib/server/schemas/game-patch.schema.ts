import { GameSchema } from './game.schema';

export const GamePatchSchema = GameSchema;

export interface GamePatchBody {
  name?: string;
  shortName?: string;
}
