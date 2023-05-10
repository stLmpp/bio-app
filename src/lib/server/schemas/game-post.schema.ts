import { GameSchema } from './game.schema';

export const GamePostSchema = GameSchema;

export interface GamePostBody {
  name: string;
  shortName: string;
}
