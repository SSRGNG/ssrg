import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import {
  partners,
  projects,
  publications,
  researchAreas,
  researchers,
} from "@/db/schema";

// Publication authors junction table
export const publicationAuthors = pgTable(
  "pub_authors",
  {
    publicationId: uuid("pub_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    researcherId: uuid("researcher_id")
      .notNull()
      .references(() => researchers.id, { onDelete: "cascade" }),
    order: integer("order").notNull(), // To maintain author ordering
    contribution: text("contribution"),
  },
  (t) => [
    primaryKey({ columns: [t.publicationId, t.researcherId] }),
    index("pub_author_order_idx").on(t.publicationId, t.order),
  ]
);

// Research area publications junction table
export const researchAreaPublications = pgTable(
  "area_pubs",
  {
    researchAreaId: uuid("area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
    publicationId: uuid("pub_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.researchAreaId, t.publicationId] }),
    index("area_pub_order_idx").on(t.researchAreaId, t.order),
  ]
);

// Project categories junction table
export const projectCategories = pgTable(
  "proj_areas",
  {
    projectId: uuid("proj_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    areaId: uuid("area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.projectId, t.areaId] }),
    index("proj_areas_area_idx").on(t.areaId),
  ]
);

// Project partners junction table
export const partnerProjects = pgTable(
  "partner_projs",
  {
    partnerId: uuid("partner_id")
      .notNull()
      .references(() => partners.id, { onDelete: "cascade" }),
    projectId: uuid("proj_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.partnerId, t.projectId] }),
    index("partner_projs_proj_idx").on(t.projectId),
  ]
);

// Researcher area junction table
export const researcherAreas = pgTable(
  "researcher_areas",
  {
    researcherId: uuid("researcher_id")
      .notNull()
      .references(() => researchers.id, { onDelete: "cascade" }),
    areaId: uuid("area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.researcherId, t.areaId] }),
    index("researcher_areas_area_idx").on(t.areaId),
  ]
);
