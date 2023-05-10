import { z } from 'zod';
import { GameSchema } from './game.schema';

export const GameGetSchema = z.array(GameSchema);
