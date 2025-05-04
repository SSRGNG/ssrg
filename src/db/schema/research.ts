import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  projectCategories,
  researchAreaPublications,
  researcherAreas,
} from "@/db/schema";

// Research areas
export const researchAreas = pgTable(
  "research_areas",
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
  "research_area_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    researchAreaId: uuid("research_area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    order: integer("order").notNull(),
  },
  (t) => [
    index("research_area_questions_order_idx").on(t.researchAreaId, t.order),
  ]
);

// Research area methods
export const researchAreaMethods = pgTable(
  "research_area_methods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    researchAreaId: uuid("research_area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    order: integer("order").notNull(),
  },
  (t) => [
    index("research_area_methods_order_idx").on(t.researchAreaId, t.order),
  ]
);

// Research area findings
export const researchAreaFindings = pgTable(
  "research_area_findings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    researchAreaId: uuid("research_area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
    finding: text("finding").notNull(),
    order: integer("order").notNull(),
  },
  (t) => [
    index("research_area_findings_order_idx").on(t.researchAreaId, t.order),
  ]
);

// Research methodologies
export const researchMethodologies = pgTable(
  "research_methodologies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    order: integer("order").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [index("research_methodologies_order_idx").on(t.order)]
);

// Research framework
export const researchFrameworks = pgTable(
  "research_frameworks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    linkText: varchar("link_text", { length: 100 }).notNull(),
    href: varchar("href", { length: 100 }).notNull(),
    order: integer("order").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("research_frameworks_order_idx").on(t.order),
    // Validate URL format
    // check(
    //   "valid_href",
    //   sql`${t.href} ~* '^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$' OR ${t.href} ~* '^\/[a-zA-Z0-9\/_-]*$'`
    // ),
  ]
);

// Relations
export const researchAreasRelations = relations(researchAreas, ({ many }) => ({
  questions: many(researchAreaQuestions),
  methods: many(researchAreaMethods),
  findings: many(researchAreaFindings),
  researchers: many(researcherAreas),
  publications: many(researchAreaPublications),
  projects: many(projectCategories),
}));

export const researchAreaQuestionsRelations = relations(
  researchAreaQuestions,
  ({ one }) => ({
    area: one(researchAreas, {
      fields: [researchAreaQuestions.researchAreaId],
      references: [researchAreas.id],
    }),
  })
);

export const researchAreaMethodsRelations = relations(
  researchAreaMethods,
  ({ one }) => ({
    area: one(researchAreas, {
      fields: [researchAreaMethods.researchAreaId],
      references: [researchAreas.id],
    }),
  })
);

export const researchAreaFindingsRelations = relations(
  researchAreaFindings,
  ({ one }) => ({
    area: one(researchAreas, {
      fields: [researchAreaFindings.researchAreaId],
      references: [researchAreas.id],
    }),
  })
);
