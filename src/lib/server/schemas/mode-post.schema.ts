import { ModeSchema } from './mode.schema';

export const ModePostSchema = ModeSchema;

export interface ModePostBody {
  name: string;
  playerQuantity: number;
}
