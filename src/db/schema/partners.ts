import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
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

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),

  // link to users (all members must have a user record)
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),

  // membership metadata
  type: text("type")
    .$type<"individual" | "organization">()
    .default("individual"),
  status: text("status")
    .$type<"pending" | "approved" | "rejected">()
    .default("pending"),

  // optional profile extras
  interests: text("interests").array(),

  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
