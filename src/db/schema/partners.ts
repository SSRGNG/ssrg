import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { partnerProjects } from "@/db/schema";
import { Partner } from "@/types";

export const partners = pgTable(
  "partners",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    logo: text("logo"),
    website: text("website"),
    description: text("description").notNull(),
    partnerType: varchar("partner_type", { length: 50 })
      .$type<Partner>()
      .notNull(),
    featured: boolean("featured").notNull().default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("partners_featured_idx").on(t.featured),
    index("partners_type_idx").on(t.partnerType),
    // Validate partner type
    // check(
    //   "valid_partner_type",
    //   sql`${t.partnerType} IN ('academic', 'nonprofit', 'government', 'industry', 'other')`
    // ),
    // Validate website format if provided
    // check(
    //   "valid_website_url",
    //   sql`${t.website} IS NULL OR ${t.website} ~* '^https?://.+$'`
    // ),
  ]
);

export const scholarships = pgTable(
  "scholarships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    eligibility: text("eligibility").notNull(),
    amount: text("amount"),
    deadline: timestamp("deadline", { mode: "date" }),
    applicationLink: text("application_link"),
    active: boolean("active").default(true).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("scholarships_active_idx").on(t.active),
    index("scholarships_deadline_idx").on(t.deadline),
    // Validate application link format if provided
    // check(
    //   "valid_application_link",
    //   sql`${t.applicationLink} IS NULL OR ${t.applicationLink} ~* '^https?://.+$'`
    // ),
  ]
);

// Relations
export const partnersRelations = relations(partners, ({ many }) => ({
  projects: many(partnerProjects),
}));
