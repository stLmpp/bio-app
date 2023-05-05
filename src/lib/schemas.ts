import { ZodDefault, ZodOptional, ZodType, z } from 'zod';

export const PageQuerySchema = z
  .string()
  .trim()
  .nonempty()
  .regex(/^\d+$/)
  .transform((value) => Number(value))
  .refine((value) => value > 0, 'Must be greater than 0');

export function zFallback<T extends ZodType>(
  schema: T,
  fallback: z.infer<T>
): ZodDefault<ZodOptional<T>> & {
  parseOrFallback(data: unknown): z.infer<T>;
} {
  const newSchema = schema.optional().default(fallback);
  (
    newSchema as ZodDefault<ZodOptional<T>> & {
      parseOrFallback(data: unknown): z.infer<T>;
    }
  ).parseOrFallback = (data: unknown) => {
    const result = schema.safeParse(data);
    return result.success ? result.data : fallback;
  };
  return newSchema as ZodDefault<ZodOptional<T>> & {
    parseOrFallback(data: unknown): z.infer<T>;
  };
}
