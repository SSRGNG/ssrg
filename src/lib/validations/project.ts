import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  period: z.string().min(3, "Period must be at least 3 characters"),
  leadResearcherId: z.string().uuid(),
  location: z.string(),
  href: z.string().url("Invalid URL"),
  image: z.string(),
});

export const projectCategorySchema = z.object({
  areaId: z.string().uuid(),
});

export const partnerProjectSchema = z.object({
  partnerId: z.string().uuid(),
});

export const createProjectSchema = projectSchema.extend({
  categories: z.array(projectCategorySchema).optional(),
  partners: z.array(partnerProjectSchema).optional(),
});

export const updateProjectSchema = projectSchema.partial().extend({
  categories: z.array(projectCategorySchema).optional(),
  partners: z.array(partnerProjectSchema).optional(),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectCategory = z.infer<typeof projectCategorySchema>;
export type PartnerProject = z.infer<typeof partnerProjectSchema>;
export type CreateProjectPayload = z.infer<typeof createProjectSchema>;
export type UpdateProjectPayload = z.infer<typeof updateProjectSchema>;
