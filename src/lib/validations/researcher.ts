import { z } from "zod";

export const researcherSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  x: z.string().optional().nullable(),
  orcid: z.string().optional().nullable(),
  featured: z.boolean().default(false),
});

export const researcherExpertiseSchema = z.object({
  expertise: z.string().min(2, "Expertise must be at least 2 characters"),
  order: z.number().int().nonnegative(),
});

export const researcherEducationSchema = z.object({
  education: z.string().min(2, "Education must be at least 2 characters"),
  order: z.number().int().nonnegative(),
});

export const researcherAreaSchema = z.object({
  areaId: z.string().uuid(),
});

export const createResearcherSchema = researcherSchema.extend({
  expertise: z.array(researcherExpertiseSchema).optional(),
  education: z.array(researcherEducationSchema).optional(),
  areas: z.array(researcherAreaSchema).optional(),
});

export const updateResearcherSchema = researcherSchema.partial().extend({
  id: z.string().uuid(),
  expertise: z.array(researcherExpertiseSchema).optional(),
  education: z.array(researcherEducationSchema).optional(),
  areas: z.array(researcherAreaSchema).optional(),
});

// For individual expertise update/create
export const createExpertiseSchema = researcherExpertiseSchema.extend({
  researcherId: z.string().uuid(),
});

export const updateExpertiseSchema = createExpertiseSchema.partial();

// For individual education update/create
export const createEducationSchema = researcherEducationSchema.extend({
  researcherId: z.string().uuid(),
});

export const updateEducationSchema = createEducationSchema.partial();

// For individual area association update/create
export const createResearcherAreaSchema = researcherAreaSchema.extend({
  researcherId: z.string().uuid(),
});

// Type exports
export type Researcher = z.infer<typeof researcherSchema>;
export type ResearcherExpertise = z.infer<typeof researcherExpertiseSchema>;
export type ResearcherEducation = z.infer<typeof researcherEducationSchema>;
export type ResearcherArea = z.infer<typeof researcherAreaSchema>;

export type CreateResearcherPayload = z.infer<typeof createResearcherSchema>;
export type UpdateResearcherPayload = z.infer<typeof updateResearcherSchema>;

export type CreateExpertisePayload = z.infer<typeof createExpertiseSchema>;
export type UpdateExpertisePayload = z.infer<typeof updateExpertiseSchema>;

export type CreateEducationPayload = z.infer<typeof createEducationSchema>;
export type UpdateEducationPayload = z.infer<typeof updateEducationSchema>;

export type CreateResearcherAreaPayload = z.infer<
  typeof createResearcherAreaSchema
>;
