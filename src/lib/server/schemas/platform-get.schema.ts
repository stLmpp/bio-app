import { z } from 'zod';
import { PlatformSchema } from './platform.schema';

export const PlatformGetSchema = z.array(PlatformSchema);
