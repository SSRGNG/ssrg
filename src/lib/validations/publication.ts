import { z } from "zod";

import { publications } from "@/config/enums";

const basePublicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  abstract: z.string().optional().nullable(),
  link: z.string().url("Invalid URL").optional().nullable(),
  creatorId: z.string().uuid().optional().nullable(),
  publicationDate: z.coerce.date().optional().nullable(),
  doi: z.string().optional().nullable(),
  venue: z.string().optional().nullable(), // Journal name OR conference name
});

const baseCreateInputSchema = basePublicationSchema.omit({ venue: true });

// Metadata schemas for different publication types
export const journalMetadataSchema = z.object({
  journal: z.string().min(1, "Journal name is required"),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
});

export const conferenceMetadataSchema = z.object({
  conferenceName: z.string().min(1, "Conference name is required"),
  conferenceLocation: z.string().optional(),
  conferenceDate: z
    .string()
    .datetime({ message: "Invalid ISO date string for conference metadata" })
    .optional(),
});

export const bookChapterMetadataSchema = z.object({
  bookTitle: z.string().min(1, "Book title is required"),
  publisher: z.string().optional(),
  city: z.string().optional(),
  isbn: z.string().optional(),
});

export const reportMetadataSchema = z.object({
  organization: z.string().optional(),
  reportNumber: z.string().optional(),
});

export const genericMetadataSchema = z.record(z.any());

// Publication type discriminated union
const journalArticleSchema = baseCreateInputSchema.extend({
  type: z.literal("journal_article"),
  venue: z.string().min(1, "Journal name is required for journal articles"),
  metadata: journalMetadataSchema,
});

const conferencePaperSchema = baseCreateInputSchema.extend({
  type: z.literal("conference_paper"),
  venue: z.string().min(1, "Conference name is required for conference papers"),
  metadata: conferenceMetadataSchema,
});

const bookChapterSchema = basePublicationSchema.extend({
  type: z.literal("book_chapter"),
  metadata: bookChapterMetadataSchema,
});

const reportSchema = basePublicationSchema.extend({
  type: z.literal("report"),
  metadata: reportMetadataSchema,
});

const otherSchema = basePublicationSchema.extend({
  type: z.enum(["working_paper", "other"]),
  metadata: genericMetadataSchema,
});

// Main publication schema as discriminated union
export const publicationSchema = z.discriminatedUnion("type", [
  journalArticleSchema,
  conferencePaperSchema,
  bookChapterSchema,
  reportSchema,
  otherSchema,
]);

export const publicationAuthorSchema = z.object({
  researcherId: z.string().uuid(),
  order: z.number().int().nonnegative(),
  contribution: z.string().optional().nullable(),
});

export const researchAreaPublicationSchema = z.object({
  researchAreaId: z.string().uuid(),
  publicationId: z.string().uuid(),
  order: z.number().int().nonnegative(),
});

// Main create/update schemas
const baseCreateUpdateSchema = basePublicationSchema.extend({
  type: publications.schema,
  metadata: z
    .union([
      journalMetadataSchema,
      conferenceMetadataSchema,
      bookChapterMetadataSchema,
      reportMetadataSchema,
      genericMetadataSchema,
    ])
    .optional(),
  authors: z.array(publicationAuthorSchema).optional(),
  areas: z.array(researchAreaPublicationSchema).optional(),
});

export const createPublicationSchema = baseCreateUpdateSchema
  .omit({ creatorId: true })
  .superRefine((data, ctx) => {
    // Custom validation based on type
    if (data.type === "journal_article") {
      if (!data.venue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Venue (journal name) is required for journal articles",
          path: ["venue"],
        });
      }

      // Validate journal metadata structure
      if (data.metadata && !("journal" in data.metadata)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Journal metadata must contain journal field",
          path: ["metadata", "journal"],
        });
      }
    }

    if (data.type === "conference_paper") {
      if (!data.venue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Venue (conference name) is required for conference papers",
          path: ["venue"],
        });
      }

      // Validate conference metadata structure
      if (data.metadata && !("conferenceName" in data.metadata)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Conference metadata must contain conferenceName field",
          path: ["metadata", "conferenceName"],
        });
      }
    }

    if (data.type === "book_chapter") {
      if (!data.metadata || !("bookTitle" in data.metadata)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Book title is required for book chapters",
          path: ["metadata", "bookTitle"],
        });
      }
    }
  });

export const updatePublicationSchema = baseCreateUpdateSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  })
  .superRefine((data, ctx) => {
    // Apply validation only if type is provided (since it's partial)
    if (!data.type) return;

    if (data.type === "journal_article") {
      if (data.venue !== undefined && !data.venue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Venue (journal name) is required for journal articles",
          path: ["venue"],
        });
      }

      if (data.metadata && !("journal" in data.metadata)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Journal metadata must contain journal field",
          path: ["metadata", "journal"],
        });
      }
    }

    if (data.type === "conference_paper") {
      if (data.venue !== undefined && !data.venue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Venue (conference name) is required for conference papers",
          path: ["venue"],
        });
      }

      if (data.metadata && !("conferenceName" in data.metadata)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Conference metadata must contain conferenceName field",
          path: ["metadata", "conferenceName"],
        });
      }
    }

    if (data.type === "book_chapter") {
      if (data.metadata && !("bookTitle" in data.metadata)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Book title is required for book chapters",
          path: ["metadata", "bookTitle"],
        });
      }
    }
  });

export type PublicationAuthor = z.infer<typeof publicationAuthorSchema>;
export type ResearchAreaPublication = z.infer<
  typeof researchAreaPublicationSchema
>;
export type CreatePublicationPayload = z.infer<typeof createPublicationSchema>;
export type UpdatePublicationPayload = z.infer<typeof updatePublicationSchema>;

// Utility functions for type-safe validation
export function validateCreatePublication(data: CreatePublicationPayload) {
  return createPublicationSchema.safeParse(data);
}

export function validateUpdatePublication(data: UpdatePublicationPayload) {
  return updatePublicationSchema.safeParse(data);
}
