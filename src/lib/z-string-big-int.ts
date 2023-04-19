import { z } from 'zod';

export const zStringBigInt = z
  .string()
  .trim()
  .nonempty()
  .regex(/^\d+$/)
  .transform((value) => BigInt(value));
