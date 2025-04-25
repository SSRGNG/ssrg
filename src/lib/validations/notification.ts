import { emailSchema } from "@/lib/validations/auth";
import * as z from "zod";

export const joinNewsletterSchema = z.object({
  email: emailSchema.shape.email,
  token: z.string(),
  subject: z.string().optional(),
});

export const updateNotificationSchema = z.object({
  token: z.string(),
  communication: z.boolean().default(false).optional(),
  newsletter: z.boolean().default(false).optional(),
  marketing: z.boolean().default(false).optional(),
});

export type JoinNewsletterPayload = z.infer<typeof joinNewsletterSchema>;
export type UpdateNotificationPayload = z.infer<
  typeof updateNotificationSchema
>;
