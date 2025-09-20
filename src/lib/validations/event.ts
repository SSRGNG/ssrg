import { z } from "zod";

import {
  events,
  presenterRoles,
  scholarshipCats,
  scholarships,
} from "@/config/enums";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eventType: events.schema,
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  location: z.string().optional().nullable(),
  virtualLink: z.string().url("Invalid URL").optional().nullable(),
  image: z.string().optional().nullable(),
  registrationLink: z.string().url("Invalid URL").optional().nullable(),
});

export const eventPresenterSchema = z
  .object({
    researcherId: z.string().uuid().optional().nullable(),
    externalName: z.string().optional().nullable(),
    externalAffiliation: z.string().optional().nullable(),
    role: presenterRoles.schema,
    order: z.number().int().nonnegative(),
  })
  .refine((data) => data.researcherId !== null || data.externalName !== null, {
    message: "Either researcherId or externalName must be provided",
    path: ["researcherId", "externalName"],
  });

const eventMediaSchema = z.object({
  eventId: z.string().uuid().optional().or(z.literal("")),
  fileId: z.string().uuid(),
  caption: z.string().optional(),
  externalEvent: z.string().optional(),
  externalLocation: z.string().optional(),
  externalDate: z.date().optional(),
  isPublic: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).optional(),
});

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
  externalEvent: z.string().optional(),
  caption: z.string().optional(),
  isPublic: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export const createEventSchema = eventSchema.extend({
  presenters: z.array(eventPresenterSchema).optional(),
});
export const createScholarshipSchema = scholarshipSchema;
export const createRecipientSchema = recipientSchema;
export const createAwardMediaSchema = awardMediaSchema;
// export const createAwardMediaSchema = awardMediaSchema.refine(
//   (data) => data.scholarshipId || data.recipientId,
//   {
//     message: "Either scholarship or recipient must be specified",
//     path: ["scholarshipId"],
//   }
// );
export const createEventMediaSchema = eventMediaSchema;

export const updateEventSchema = eventSchema.partial().extend({
  presenters: z.array(eventPresenterSchema).optional(),
});
export const updateScholarshipSchema = scholarshipSchema.partial();
export const updateRecipientSchema = recipientSchema.partial();
export const updateAwardMediaSchema = awardMediaSchema.extend({
  id: z.string().min(1, "ID is required"),
});
export const updateEventMediaSchema = eventMediaSchema
  .omit({ sortOrder: true })
  .extend({
    id: z.string().min(1, "ID is required"),
    sortOrder: z.number().int().min(0),
  });

export type Event = z.infer<typeof eventSchema>;
export type EventPresenter = z.infer<typeof eventPresenterSchema>;
export type CreateEventPayload = z.infer<typeof createEventSchema>;
export type UpdateEventPayload = z.infer<typeof updateEventSchema>;
export type CreateEventMediaPayload = z.infer<typeof createEventMediaSchema>;
export type Scholarship = z.infer<typeof scholarshipSchema>;
export type CreateScholarshipPayload = z.infer<typeof createScholarshipSchema>;
export type CreateRecipientPayload = z.infer<typeof createRecipientSchema>;
export type CreateAwardMediaPayload = z.infer<typeof createAwardMediaSchema>;
export type UpdateScholarshipPayload = z.infer<typeof updateScholarshipSchema>;
export type UpdateRecipientPayload = z.infer<typeof updateRecipientSchema>;
export type UpdateAwardMediaPayload = z.infer<typeof updateAwardMediaSchema>;
export type UpdateEventMediaPayload = z.infer<typeof updateEventMediaSchema>;
