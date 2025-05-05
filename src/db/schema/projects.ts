import { sql } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { researchers } from "@/db/schema";

// Projects table
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    period: varchar("period", { length: 100 }).notNull(),
    leadResearcherId: uuid("lead_researcher_id")
      .notNull()
      .references(() => researchers.id, { onDelete: "restrict" }),
    location: varchar("location", { length: 255 }).notNull(),
    href: text("href").notNull(),
    image: text("image").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("projects_lead_researcher_idx").on(t.leadResearcherId),
    index("projects_title_idx").on(t.title),
    // Validate URL format
    // check(
    //   "valid_href",
    //   sql`${t.href} ~* '^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$' OR ${t.href} ~* '^\/[a-zA-Z0-9\/_-]*$'`
    // ),
  ]
);
