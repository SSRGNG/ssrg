import { videoCats, videoResearcherRoles } from "@/config/enums";
import { z } from "zod";

export const videoMetadataSchema = z.object({
  // YouTube specific
  youtubeId: z.string().min(1, "YouTube ID is required"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
  duration: z
    .string()
    .regex(
      /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/,
      "Duration must be in ISO 8601 format (e.g., PT4M20S)"
    ),

  // Engagement metrics
  viewCount: z.number().int().min(0).optional(),
  likeCount: z.number().int().min(0).optional(),
  commentCount: z.number().int().min(0).optional(),

  // Video details
  language: z
    .string()
    .min(2, "Language code must be at least 2 characters")
    .optional(),
  captions: z.boolean().optional(),
  quality: z.enum(["SD", "HD", "4K", "8K"]).optional(),
  definition: z.string().optional(),

  // Research context
  relatedPublications: z
    .array(z.string().uuid("Invalid publication ID"))
    .optional(),
  researchArea: z.string().min(1, "Research area cannot be empty").optional(),
  targetAudience: z
    .enum(["academic", "general", "students", "practitioners"])
    .optional(),

  // Additional metadata
  transcript: z.string().optional(),
  keywords: z.array(z.string().min(1, "Keywords cannot be empty")).optional(),
});

export const videoSchema = z.object({
  id: z.string().uuid().optional(),

  // Basic video info
  title: z.string().min(1, "Title is required").max(500, "Title too long"),
  description: z.string().max(5000, "Description too long").optional(),
  youtubeUrl: z
    .string()
    .url("Invalid YouTube URL")
    .refine(
      (url) => url.includes("youtube.com") || url.includes("youtu.be"),
      "Must be a valid YouTube URL"
    ),
  youtubeId: z
    .string()
    .min(1, "YouTube ID is required")
    .max(50, "YouTube ID too long"),

  // Timestamps
  publishedAt: z.string().datetime("Invalid date format").or(z.date()),
  recordedAt: z
    .string()
    .datetime("Invalid date format")
    .or(z.date())
    .optional(),

  // Categorization
  category: videoCats.schema.optional(),
  series: z.string().max(255, "Series name too long").optional(),

  // Creator
  creatorId: z.string().uuid("Invalid creator ID").optional(),

  // Metadata
  metadata: videoMetadataSchema.optional(),

  // Engagement tracking
  viewCount: z.number().int().min(0).default(0),
  lastMetricsUpdate: z.date().optional(),

  // Status
  isPublic: z.boolean().default(true),
  isFeatured: z.boolean().default(false),

  // Standard timestamps
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Video researcher relationship schema
export const videoAuthorSchema = z.object({
  videoId: z.string().uuid("Invalid video ID"),
  authorId: z.string().uuid("Invalid author ID"),
  role: videoResearcherRoles.schema.optional(),
  order: z.number().int().min(0, "Order must be at least 0"),
});

// Create video schema (for API endpoints)
export const createVideoSchema = videoSchema
  .omit({
    id: true,
    youtubeId: true,
    viewCount: true,
    lastMetricsUpdate: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    authors: z
      .array(
        videoAuthorSchema.omit({ videoId: true, authorId: true }).extend({
          id: z.string().uuid("Invalid author ID").optional(),
          researcherId: z
            .string()
            .uuid("Invalid researcher ID")
            .optional()
            .nullable(),
          orcid: z.string().optional().nullable(),
          name: z.string().min(2, "Author name must be at least 2 characters"),
          email: z
            .string()
            .email({ message: "Please enter a valid email address" })
            .optional()
            .nullable(),
          affiliation: z.string().optional().nullable(),
        })
      )
      .optional(),
    // authors: z
    //   .array(
    //     z.object({
    //       authorId: z.string().uuid("Invalid author ID").optional(),
    //       role: videoResearcherRoles.schema.optional(),
    //       order: z.number().int().min(0).default(0),
    //       type: z.enum(["researcher", "author"]).optional(),
    //       name: z.string().optional(),
    //       email: z.string().optional(),
    //       affiliation: z.string().optional(),
    //       userId: z.string().optional(),
    //       title: z.string().optional(),
    //       bio: z.string().optional(),
    //       featured: z.boolean().optional(),
    //       orcid: z.string().optional(),
    //       avatar: z.string().optional(),
    //       publicationCount: z.number().optional(),
    //     })
    //   )
    //   .optional(),
  });
// export const createVideoSchema = z.object({
//   title: z.string().min(1, "Title is required").max(500, "Title too long"),
//   description: z.string().max(5000, "Description too long").optional(),
//   youtubeUrl: z
//     .string()
//     .url("Invalid YouTube URL")
//     .refine(
//       (url) => url.includes("youtube.com") || url.includes("youtu.be"),
//       "Must be a valid YouTube URL"
//     ),

//   // Timestamps
//   publishedAt: z.string().datetime("Invalid date format").or(z.date()),
//   recordedAt: z
//     .string()
//     .datetime("Invalid date format")
//     .or(z.date())
//     .optional(),

//   // Categorization
//   category: videoCats.schema.optional(),
//   series: z.string().max(255, "Series name too long").optional(),

//   // Creator
//   creatorId: z.string().uuid("Invalid creator ID").optional(),

//   // Metadata
//   metadata: videoMetadataSchema.optional(),

//   // Status
//   isPublic: z.boolean().default(true),
//   isFeatured: z.boolean().default(false),

//   // Associated researchers
//   researchers: z
//     .array(
//       z.object({
//         authorId: z.string().uuid("Invalid author ID").optional(),
//         role: videoResearcherRoles.schema.optional(),
//         order: z.number().int().min(0).default(0),
//         type: z.enum(["researcher", "author"]).optional(),
//         name: z.string().optional(),
//         email: z.string().optional(),
//         affiliation: z.string().optional(),
//         userId: z.string().optional(),
//         title: z.string().optional(),
//         bio: z.string().optional(),
//         featured: z.boolean().optional(),
//         orcid: z.string().optional(),
//         avatar: z.string().optional(),
//         publicationCount: z.number().optional(),
//       })
//     )
//     .optional(),
// });

// Update video schema (all fields optional except id)
export const updateVideoSchema = createVideoSchema
  .partial()
  .extend({ id: z.string().uuid("Invalid video ID") });

export type Video = z.infer<typeof videoSchema>;
export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;

// Helper function to extract YouTube ID from URL
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Helper function to validate and extract YouTube ID
export const youtubeUrlToIdSchema = z
  .string()
  .url()
  .transform((url, ctx) => {
    const id = extractYouTubeId(url);
    if (!id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid YouTube URL format",
      });
      return z.NEVER;
    }
    return id;
  });

// Enhanced create schema that auto-extracts YouTube ID
export const createVideoWithAutoIdSchema = createVideoSchema
  .extend({
    youtubeUrl: youtubeUrlToIdSchema,
  })
  .transform((data) => ({
    ...data,
    youtubeId: data.youtubeUrl, // This will be the extracted ID
    youtubeUrl: data.youtubeUrl, // This will be the original URL (you might want to reconstruct canonical URL)
  }));
