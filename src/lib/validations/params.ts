import * as z from "zod";

import { publications, videoCats } from "@/config/enums";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.string().optional().default("createdAt.desc"),
});

export const expensesSearchParamsSchema = searchParamsSchema
  .omit({ sort: true })
  .extend({
    sort: z.string().optional().default("date.desc"),
    description: z.string().optional(),
  });

export const videoQuerySchema = z.object({
  // Pagination
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),

  // Search
  search: z.string().optional(),

  // Filters
  category: videoCats.schema.optional(),
  series: z.string().optional(),
  creatorId: z.string().uuid().optional(),
  researcherId: z.string().uuid().optional(),
  isPublic: z.boolean().optional(),
  isFeatured: z.boolean().optional(),

  // Date filters
  publishedAfter: z.string().datetime().or(z.date()).optional(),
  publishedBefore: z.string().datetime().or(z.date()).optional(),

  // Sorting
  sortBy: z
    .enum(["publishedAt", "title", "viewCount", "created_at"])
    .default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const publicationQuerySchema = z.object({
  // Pagination
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),

  // Search
  search: z.string().optional(),

  // Filters
  type: publications.schema.optional(),
  publishedAfter: z.string().datetime().or(z.date()).optional(),
  publishedBefore: z.string().datetime().or(z.date()).optional(),

  // Sorting
  sortBy: z
    .enum(["publicationDate", "title", "citationCount", "created_at"])
    .default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type VideoQueryInput = Partial<z.infer<typeof videoQuerySchema>>;
export type PublicationQueryInput = Partial<
  z.infer<typeof publicationQuerySchema>
>;
