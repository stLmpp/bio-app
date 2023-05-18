import { z } from 'zod';
import { ModeSchema } from './mode.schema';

export const ModeGetSchema = z.array(ModeSchema);
