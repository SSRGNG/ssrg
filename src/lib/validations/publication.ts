import { z } from "zod";

export const publicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  abstract: z.string().optional().nullable(),
  link: z.string().url("Invalid URL").optional().nullable(),
  leadAuthorId: z.string().uuid().optional().nullable(),
  publicationDate: z.string().or(z.date()).optional().nullable(),
  journal: z.string().optional().nullable(),
  volume: z.string().optional().nullable(),
  issue: z.string().optional().nullable(),
  pages: z.string().optional().nullable(),
  doi: z.string().optional().nullable(),
  isbn: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  editedBook: z.boolean().optional().nullable(),
  conferenceName: z.string().optional().nullable(),
  conferenceLocation: z.string().optional().nullable(),
  conferenceDate: z.string().or(z.date()).optional().nullable(),
});

export const publicationAuthorSchema = z.object({
  researcherId: z.string().uuid(),
  order: z.number().int().nonnegative(),
});

export const researchAreaPublicationSchema = z.object({
  researchAreaId: z.string().uuid(),
  publicationId: z.string().uuid(),
  order: z.number().int().nonnegative(),
});

export const createPublicationSchema = publicationSchema.extend({
  authors: z.array(publicationAuthorSchema).optional(),
  areas: z
    .array(
      z.object({
        researchAreaId: z.string().uuid(),
        order: z.number().int().nonnegative().optional(),
      })
    )
    .optional(),
});

export const updatePublicationSchema = publicationSchema.partial().extend({
  authors: z.array(publicationAuthorSchema).optional(),
  areas: z
    .array(
      z.object({
        researchAreaId: z.string().uuid(),
        order: z.number().int().nonnegative().optional(),
      })
    )
    .optional(),
});

export type Publication = z.infer<typeof publicationSchema>;
export type PublicationAuthor = z.infer<typeof publicationAuthorSchema>;
export type ResearchAreaPublication = z.infer<
  typeof researchAreaPublicationSchema
>;
export type CreatePublicationPayload = z.infer<typeof createPublicationSchema>;
export type UpdatePublicationPayload = z.infer<typeof updatePublicationSchema>;
