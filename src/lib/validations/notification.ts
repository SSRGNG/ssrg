import * as z from "zod";

import { emailSchema } from "@/lib/validations/auth";

export const notificationSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  email: z.string().email("Invalid email address"),
  referredBy: z.string().uuid().optional().nullable(),
  communication: z.boolean().default(false),
  newsletter: z.boolean().default(false),
  marketing: z.boolean().default(false),
});

export const joinNewsletterSchema = z.object({
  email: emailSchema.shape.email,
  token: z.string(),
  subject: z.string().optional(),
});

export const createNotificationSchema = notificationSchema;

export const updateNotificationSchema = z.object({
  token: z.string(),
  communication: z.boolean().default(false).optional(),
  newsletter: z.boolean().default(false).optional(),
  marketing: z.boolean().default(false).optional(),
});

export type Notification = z.infer<typeof notificationSchema>;
export type JoinNewsletterPayload = z.infer<typeof joinNewsletterSchema>;
export type CreateNotificationPayload = z.infer<
  typeof createNotificationSchema
>;
export type UpdateNotificationPayload = z.infer<
  typeof updateNotificationSchema
>;
