import { z } from 'zod';
import { MiniGameSchema } from './mini-game.schema';

export const MiniGameGetSchema = z.array(MiniGameSchema);
