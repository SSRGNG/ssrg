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

import { users } from "@/db/schema";

// Main researcher profile
export const researchers = pgTable(
  "researchers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(), // Ensure one-to-one relationship
    title: text("title").notNull(),
    bio: text("bio").notNull(),
    x: varchar("x", { length: 50 }), // Twitter/X handle
    orcid: varchar("orcid", { length: 20 }),
    featured: boolean("featured").default(false).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("researchers_featured_idx").on(t.featured),
    check(
      "valid_orcid",
      sql`${t.orcid} IS NULL OR ${t.orcid} ~* '^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$'`
    ),
  ]
);

// Researcher expertise
export const researcherExpertise = pgTable(
  "researcher_expertise",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    researcherId: uuid("researcher_id")
      .notNull()
      .references(() => researchers.id, { onDelete: "cascade" }),
    expertise: varchar("expertise", { length: 255 }).notNull(),
    order: integer("order").notNull(),
  },
  (t) => [
    // Index for ordering
    index("researcher_expertise_order_idx").on(t.researcherId, t.order),
  ]
);

// Researcher education
export const researcherEducation = pgTable(
  "researcher_education",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    researcherId: uuid("researcher_id")
      .notNull()
      .references(() => researchers.id, { onDelete: "cascade" }),
    education: varchar("education", { length: 255 }).notNull(),
    order: integer("order").notNull(),
  },
  (t) => [
    // Index for ordering
    index("researcher_education_order_idx").on(t.researcherId, t.order),
  ]
);
