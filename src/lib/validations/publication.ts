import { z } from "zod";

import { DOI_REGEX } from "@/config/constants";
import { publications } from "@/config/enums";
import { pubAuthorSchema } from "@/lib/validations/author";

export const doiValidator = z
  .string()
  .optional()
  .nullable()
  .refine(
    (doi) => {
      if (!doi) return true; // Allow empty/null
      return DOI_REGEX.test(doi);
    },
    {
      message:
        "Invalid DOI format. DOI should start with '10.' followed by registrant code and suffix (e.g., 10.1000/182)",
    }
  );
// Author schema - supports both internal researchers and external authors
export const authorSchema = pubAuthorSchema;

const basePublicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  abstract: z.string().optional().nullable(),
  link: z.string().url("Invalid URL").optional().nullable().or(z.literal("")), // Allow empty string
  creatorId: z.string().uuid().optional().nullable(),
  publicationDate: z
    .union([
      z.date(),
      z.string().datetime(), // Full ISO string
      z.string().regex(/^\d{4}$/, "Invalid year format"), // 2023
      z.string().regex(/^\d{4}-\d{2}$/, "Invalid year-month format"), // 2023-05
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"), // 2023-05-15
    ])
    .optional()
    .nullable(),
  doi: doiValidator,
  venue: z.string().optional().nullable(),
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

// export const publicationAuthorSchema = z.object({
//   researcherId: z.string().uuid(),
//   order: z.number().int().nonnegative(),
//   contribution: z.string().optional().nullable(),
// });

export const researchAreaPublicationSchema = z.object({
  researchAreaId: z.string().uuid(),
  // publicationId: z.string().uuid(),
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
  authors: z
    .array(authorSchema)
    .min(1, "At least one author is required")
    .refine(
      (authors) => {
        // Check for unique order values
        const orders = authors.map((a) => a.order);
        return new Set(orders).size === orders.length;
      },
      {
        message: "Author order values must be unique",
      }
    )
    .refine(
      (authors) => {
        // Check for sequential ordering starting from 0
        const orders = authors.map((a) => a.order).sort((a, b) => a - b);
        return orders.every((order, index) => order === index);
      },
      {
        message:
          "Author order must be sequential starting from 0 (e.g., 0, 1, 2...)",
      }
    ),
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

    // Validate that at least one author is marked as corresponding
    if (data.authors && data.authors.length > 0) {
      const correspondingAuthors = data.authors.filter(
        (a) => a.isCorresponding
      );
      // if (correspondingAuthors.length === 0) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     message: "At least one author must be marked as corresponding author",
      //     path: ["authors"],
      //   });
      // }
      if (correspondingAuthors.length === 0) {
        // If only one author, they don't strictly need to be marked, but good practice.
        // If multiple authors, at least one must be marked.
        if (data.authors.length > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "At least one author must be marked as corresponding when multiple authors are present.",
            path: ["authors"],
          });
        } else {
          // Single author case
          // Optional: you could enforce that the single author IS corresponding
          // form.setValue(`authors.0.isCorresponding`, true) in addAuthor if only one
          // or add validation here if you want to enforce it via schema.
          // For now, if one author, this rule doesn't strictly apply by this logic.
        }
      } else if (correspondingAuthors.length > 1) {
        // Optional: If you only want one corresponding author
        // ctx.addIssue({
        //   code: z.ZodIssueCode.custom,
        //   message: "Only one author can be marked as corresponding.",
        //   path: ["authors"], // Or target specific checkboxes
        // });
      }
    }
  });

// export const updatePublicationSchema = baseCreateUpdateSchema
//   .partial()
//   .extend({
//     id: z.string().uuid(),
//   });

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

    // if (data.metadata && data.metadata.journal !== undefined && !(data.metadata.journal as string).trim()) { ... }
  });

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
