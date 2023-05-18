import { z } from 'zod';

export const PaginationMetadataSchema = z.object({
  page: z.number(),
  itemsPerPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
});
