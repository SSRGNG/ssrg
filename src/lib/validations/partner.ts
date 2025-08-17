import { z } from "zod";

import { partners } from "@/config/enums";

export const partnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  logo: z.string().optional().nullable(),
  website: z.string().url("Invalid URL").optional().nullable(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  partnerType: partners.schema,
  featured: z.boolean().default(false),
});

export const joinSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  affiliation: z.string().optional(),
  interests: z.array(z.string()).min(1, "At least one interest is required"),
  type: z.enum(["individual", "organization"]).default("individual"),
});

export const createPartnerSchema = partnerSchema;
export const updatePartnerSchema = partnerSchema.partial();

export type Partner = z.infer<typeof partnerSchema>;
export type JoinPayload = z.infer<typeof joinSchema>;
export type CreatePartnerPayload = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerPayload = z.infer<typeof updatePartnerSchema>;
