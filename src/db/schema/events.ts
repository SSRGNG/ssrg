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

import { files, users } from "@/db/schema";
import { Event } from "@/types";

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

export const eventMedia = pgTable(
  "event_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Optional: link to an event hosted by the group
    eventId: uuid("event_id").references(() => events.id, {
      onDelete: "set null",
    }),

    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),

    caption: text("caption"), // e.g., "Dr. Okafor presenting keynote"
    externalEvent: text("external_event"), // Optional: "African Social Science Conf 2025"
    externalLocation: text("external_location"),
    externalDate: timestamp("external_date", { mode: "date" }),

    isPublic: boolean("is_public").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(), // homepage carousel
    sortOrder: integer("sort_order").default(0).notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("event_media_event_idx").on(t.eventId),
    index("event_media_file_idx").on(t.fileId),
    index("event_media_public_idx").on(t.isPublic),
    index("event_media_featured_idx").on(t.isFeatured),
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
