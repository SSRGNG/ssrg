import { z } from "zod";

export const researchAreaSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  icon: z.string(),
  image: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  detail: z.string().min(10, "Detail must be at least 10 characters"),
  href: z.string(),
  linkText: z.string(),
});

export const researchAreaQuestionSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  order: z.number().int().nonnegative(),
});

export const researchAreaMethodSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  order: z.number().int().nonnegative(),
});

export const researchAreaFindingSchema = z.object({
  finding: z.string().min(5, "Finding must be at least 5 characters"),
  order: z.number().int().nonnegative(),
});

export const createResearchAreaSchema = researchAreaSchema.extend({
  questions: z.array(researchAreaQuestionSchema).optional(),
  methods: z.array(researchAreaMethodSchema).optional(),
  findings: z.array(researchAreaFindingSchema).optional(),
  publications: z
    .array(
      z.object({
        publicationId: z.string().uuid(),
        order: z.number().int().nonnegative(),
      })
    )
    .optional(),
});

export const updateResearchAreaSchema = researchAreaSchema.partial().extend({
  questions: z.array(researchAreaQuestionSchema).optional(),
  methods: z.array(researchAreaMethodSchema).optional(),
  findings: z.array(researchAreaFindingSchema).optional(),
  publications: z
    .array(
      z.object({
        publicationId: z.string().uuid(),
        order: z.number().int().nonnegative(),
      })
    )
    .optional(),
});

export type ResearchArea = z.infer<typeof researchAreaSchema>;
export type ResearchAreaQuestion = z.infer<typeof researchAreaQuestionSchema>;
export type ResearchAreaMethod = z.infer<typeof researchAreaMethodSchema>;
export type ResearchAreaFinding = z.infer<typeof researchAreaFindingSchema>;
export type CreateResearchAreaPayload = z.infer<
  typeof createResearchAreaSchema
>;
export type UpdateResearchAreaPayload = z.infer<
  typeof updateResearchAreaSchema
>;
