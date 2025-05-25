import { lower } from "@/db/utils";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Research areas
export const researchAreas = pgTable(
  "areas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    icon: varchar("icon", { length: 50 }).notNull(), // Store icon component name
    image: varchar("image", { length: 100 }).notNull(),
    description: text("description").notNull(),
    detail: text("detail").notNull(),
    href: varchar("href", { length: 100 }).notNull(),
    linkText: varchar("link_text", { length: 100 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }
  // (t) => [
  //   // Validate URL format
  //   check(
  //     "valid_href",
  //     sql`${t.href} ~* '^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$' OR ${t.href} ~* '^\/[a-zA-Z0-9\/_-]*$'`
  //   ),
  // ]
);

// Research area questions
export const researchAreaQuestions = pgTable(
  "area_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    researchAreaId: uuid("area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    order: integer("order").notNull(),
  },
  (t) => [index("area_questions_order_idx").on(t.researchAreaId, t.order)]
);

// Research area methods
export const researchAreaMethods = pgTable(
  "area_methods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    researchAreaId: uuid("area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    order: integer("order").notNull(),
  },
  (t) => [index("area_methods_order_idx").on(t.researchAreaId, t.order)]
);

// Research area findings
export const researchAreaFindings = pgTable(
  "area_findings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    researchAreaId: uuid("area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
    finding: text("finding").notNull(),
    order: integer("order").notNull(),
  },
  (t) => [index("area_findings_order_idx").on(t.researchAreaId, t.order)]
);

// Research methodologies
export const researchMethodologies = pgTable(
  "methodologies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull().unique(),
    description: text("description").notNull(),
    order: integer("order").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("methodologies_order_idx").on(t.order),
    uniqueIndex("methodologies_unique_title").on(lower(t.title)),
  ]
);

// Research framework
export const researchFrameworks = pgTable(
  "frameworks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull().unique(),
    description: text("description").notNull(),
    linkText: varchar("link_text", { length: 100 }).notNull(),
    href: varchar("href", { length: 100 }).notNull().unique(),
    order: integer("order").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("frameworks_order_idx").on(t.order),
    index("frameworks_lower_title_idx").on(lower(t.title)),
    // uniqueIndex("frameworks_title_unique").on(lower(t.title)),
    // Validate URL format
    // check(
    //   "valid_href",
    //   sql`${t.href} ~* '^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$' OR ${t.href} ~* '^\/[a-zA-Z0-9\/_-]*$'`
    // ),
  ]
);
