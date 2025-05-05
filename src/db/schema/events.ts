import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { researchers, users } from "@/db/schema";
import { Event, PresenterRole } from "@/types";

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    eventType: varchar("event_type", { length: 50 }).$type<Event>().notNull(),
    startDate: timestamp("start_date", { mode: "date" }).notNull(),
    endDate: timestamp("end_date", { mode: "date" }),
    location: text("location"),
    virtualLink: text("virtual_link"),
    image: text("image"),
    registrationLink: text("registration_link"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("events_start_date_idx").on(t.startDate),
    index("events_type_idx").on(t.eventType),
    // Validate date range
    check(
      "valid_date_range",
      sql`${t.endDate} IS NULL OR ${t.startDate} <= ${t.endDate}`
    ),
    // Add event type validation
    // check(
    //   "valid_event_type",
    //   sql`${t.eventType} IN ('workshop', 'seminar', 'conference', 'lecture', 'other')`
    // ),
  ]
);

export const eventPresenters = pgTable(
  "event_presenters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    researcherId: uuid("researcher_id").references(() => researchers.id, {
      onDelete: "set null",
    }),
    externalName: text("external_name"),
    externalAffiliation: text("external_affiliation"),
    role: varchar("role", { length: 20 }).$type<PresenterRole>().notNull(),
    order: integer("order").notNull(),
  },
  (t) => [
    // Create index for event lookup
    index("event_presenters_event_idx").on(t.eventId),
    // Create index for researcher lookup
    index("event_presenters_researcher_idx").on(t.researcherId),
    // Create unique index to prevent duplicate ordering per event
    // index("event_presenters_order_idx").on(t.eventId, t.order).unique(),
    // Ensure we have at least a researcher ID or external name
    check(
      "valid_presenter",
      sql`${t.researcherId} IS NOT NULL OR ${t.externalName} IS NOT NULL`
    ),
    // Validate presenter role
    // check(
    //   "valid_presenter_role",
    //   sql`${t.role} IN ('keynote', 'panelist', 'presenter', 'moderator', 'organizer')`
    // ),
  ]
);

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  email: text("email").notNull().unique(),
  token: text("token").notNull().unique(),
  referredBy: uuid("referred_by").references(() => users.id, {
    onDelete: "set null",
  }),
  communication: boolean("communication").default(false).notNull(),
  newsletter: boolean("newsletter").default(false).notNull(),
  marketing: boolean("marketing").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
