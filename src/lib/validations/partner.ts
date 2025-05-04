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

export const createPartnerSchema = partnerSchema;
export const updatePartnerSchema = partnerSchema.partial();

export type Partner = z.infer<typeof partnerSchema>;
export type CreatePartnerPayload = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerPayload = z.infer<typeof updatePartnerSchema>;
