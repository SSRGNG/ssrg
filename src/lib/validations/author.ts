import { z } from "zod";

import { ORCID_REGEX } from "@/config/constants";

export const orcidValidator = z
  .string()
  .optional()
  .nullable()
  .refine(
    (orcid) => {
      if (!orcid) return true;
      return ORCID_REGEX.test(orcid);
    },
    {
      message: "Invalid ORCID format. Should be in format: 0000-0000-0000-0000",
    }
  );

export const authorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Author name must be at least 2 characters"),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional()
    .nullable(),
  affiliation: z.string().optional().nullable(),
  orcid: orcidValidator,
  researcherId: z.string().uuid().optional().nullable(),
});

export const searchAuthorSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  limit: z.number().min(1).max(50).default(20),
});

export const publicationAuthorSchema = z.object({
  order: z.number().int().min(0, "Order must be at least 0"),
  contribution: z.string().optional().nullable(),
  isCorresponding: z.boolean().default(false),
});

export const pubAuthorSchema = authorSchema.merge(publicationAuthorSchema);

export const createAuthorSchema = authorSchema;

export type PublicationAuthor = z.infer<typeof publicationAuthorSchema>;
export type PubAuthor = z.infer<typeof pubAuthorSchema>;

export type CreateAuthorPayload = z.infer<typeof createAuthorSchema>;
export type SearchAuthorPayload = z.infer<typeof searchAuthorSchema>;
