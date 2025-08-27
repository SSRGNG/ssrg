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

import { events, files } from "@/db/schema";
import { Scholarship, ScholarshipCategory } from "@/types";

export const scholarships = pgTable(
  "scholarships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: varchar("type", { length: 30 })
      .$type<Scholarship>()
      .notNull()
      .default("other"),
    category: varchar("category", { length: 50 })
      .$type<ScholarshipCategory>()
      .notNull()
      .default("student"),
    eligibility: text("eligibility").notNull(),
    amount: text("amount"),
    deadline: timestamp("deadline", { mode: "date" }),
    applicationLink: text("application_link"),
    active: boolean("active").default(true).notNull(),
    recurring: boolean("recurring").default(false).notNull(), // For annual scholarships
    maxRecipients: integer("max_recipients"), // e.g., "First 10 students"
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("scholarships_active_idx").on(t.active),
    index("scholarships_deadline_idx").on(t.deadline),
    index("scholarships_type_idx").on(t.type),
    index("scholarships_category_idx").on(t.category),
  ]
);

// Recipients table to store scholarship/award recipients
export const recipients = pgTable(
  "recipients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scholarshipId: uuid("scholarship_id")
      .notNull()
      .references(() => scholarships.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    affiliation: text("affiliation"), // e.g., "Department of Social Work, UNN"
    year: integer("year").notNull(),
    amount: text("amount"), // Individual amount if different from scholarship base amount
    notes: text("notes"), // Additional info about the recipient
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("recipients_scholarship_idx").on(t.scholarshipId),
    index("recipients_year_idx").on(t.year),
    index("recipients_name_idx").on(t.name),
  ]
);

// Award ceremony photos and documentation
export const awardMedia = pgTable(
  "award_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scholarshipId: uuid("scholarship_id").references(() => scholarships.id, {
      onDelete: "cascade",
    }),
    recipientId: uuid("recipient_id").references(() => recipients.id, {
      onDelete: "cascade",
    }),
    eventId: uuid("event_id").references(() => events.id, {
      onDelete: "set null",
    }), // Optional: link to event if applicable

    // Link to files table instead of storing URL directly
    fileId: uuid("file_id")
      .references(() => files.id, {
        onDelete: "cascade",
      })
      .notNull(),

    // Fields for award-specific metadata
    caption: text("caption"), // Description of the photo/media
    isPublic: boolean("is_public").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("award_media_scholarship_idx").on(t.scholarshipId),
    index("award_media_recipient_idx").on(t.recipientId),
    index("award_media_event_idx").on(t.eventId),
    index("award_media_file_idx").on(t.fileId),
    index("award_media_public_idx").on(t.isPublic),
    // Ensure at least one parent reference
    check(
      "valid_media_parent",
      sql`${t.scholarshipId} IS NOT NULL OR ${t.recipientId} IS NOT NULL`
    ),
  ]
);
