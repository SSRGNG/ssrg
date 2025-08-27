import { scholarshipCats, scholarships } from "@/config/enums";
import { z } from "zod";

export const scholarshipSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eligibility: z.string().min(10, "Eligibility must be at least 10 characters"),
  type: scholarships.schema.default("other"),
  category: scholarshipCats.schema.default("student"),
  amount: z.string().optional(),
  deadline: z.date().optional(),
  applicationLink: z.string().url().optional().or(z.literal("")),
  active: z.boolean().default(true),
  recurring: z.boolean().default(false),
  maxRecipients: z.number().optional(),
});

const recipientSchema = z.object({
  scholarshipId: z.string().min(1, "Please select a scholarship"),
  name: z.string().min(1, "Name is required"),
  affiliation: z.string().optional(),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 10),
  amount: z.string().optional(),
  notes: z.string().optional(),
});

const awardMediaSchema = z.object({
  scholarshipId: z.string().uuid().optional().or(z.literal("")),
  recipientId: z.string().uuid().optional().or(z.literal("")),
  eventId: z.string().uuid().optional().or(z.literal("")),
  fileId: z.string().uuid(),
  caption: z.string().optional(),
  isPublic: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const createScholarshipSchema = scholarshipSchema;
export const createRecipientSchema = recipientSchema;
export const createAwardMediaSchema = awardMediaSchema.refine(
  (data) => data.scholarshipId || data.recipientId,
  {
    message: "Either scholarship or recipient must be specified",
    path: ["scholarshipId"],
  }
);

export const updateScholarshipSchema = scholarshipSchema.partial();
export const updateRecipientSchema = recipientSchema.partial();
export const updateAwardMediaSchema = awardMediaSchema.partial();

export type Scholarship = z.infer<typeof scholarshipSchema>;
export type CreateScholarshipPayload = z.infer<typeof createScholarshipSchema>;
export type CreateRecipientPayload = z.infer<typeof createRecipientSchema>;
export type CreateAwardMediaPayload = z.infer<typeof createAwardMediaSchema>;
export type UpdateScholarshipPayload = z.infer<typeof updateScholarshipSchema>;
export type UpdateRecipientPayload = z.infer<typeof updateRecipientSchema>;
export type UpdateAwardMediaPayload = z.infer<typeof updateAwardMediaSchema>;
