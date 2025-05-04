import { z } from "zod";

import { events, presenterRoles } from "@/config/enums";

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

export const createEventSchema = eventSchema.extend({
  presenters: z.array(eventPresenterSchema).optional(),
});

export const updateEventSchema = eventSchema.partial().extend({
  presenters: z.array(eventPresenterSchema).optional(),
});

export type Event = z.infer<typeof eventSchema>;
export type EventPresenter = z.infer<typeof eventPresenterSchema>;
export type CreateEventPayload = z.infer<typeof createEventSchema>;
export type UpdateEventPayload = z.infer<typeof updateEventSchema>;
