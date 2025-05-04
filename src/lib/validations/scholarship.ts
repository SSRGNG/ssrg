import { z } from "zod";

export const scholarshipSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eligibility: z.string().min(10, "Eligibility must be at least 10 characters"),
  amount: z.string().optional().nullable(),
  deadline: z.string().or(z.date()).optional().nullable(),
  applicationLink: z.string().url("Invalid URL").optional().nullable(),
  active: z.boolean().default(true),
});

export const createScholarshipSchema = scholarshipSchema;
export const updateScholarshipSchema = scholarshipSchema.partial();

export type Scholarship = z.infer<typeof scholarshipSchema>;
export type CreateScholarshipPayload = z.infer<typeof createScholarshipSchema>;
export type UpdateScholarshipPayload = z.infer<typeof updateScholarshipSchema>;
