import { z } from 'zod';
import { RegionSchema } from './region.schema';

export const RegionGetSchema = z.array(RegionSchema);
