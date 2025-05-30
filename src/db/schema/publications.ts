import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
import type { PublicationMetadata, PublicationType } from "@/types";

export const publications = pgTable(
  "publications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: varchar("type", { length: 50 }).$type<PublicationType>().notNull(),
    title: text("title").notNull(),
    abstract: text("abstract"),
    link: varchar("link", { length: 500 }),
    creatorId: uuid("creator_id").references(() => users.id, {
      onDelete: "set null",
    }),
    publicationDate: timestamp("publication_date"),
    doi: varchar("doi", { length: 255 }),
    venue: varchar("venue", { length: 255 }), // Journal name OR conference name... most commonly queried field for the type
    metadata: jsonb("metadata").$type<PublicationMetadata>(),
    citationCount: integer("citation_count").default(0),
    lastCitationUpdate: timestamp("last_citation_update"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("publication_type_idx").on(t.type),
    index("publication_date_idx").on(t.publicationDate),
    index("publication_doi_idx").on(t.doi),
    index("citation_count_idx").on(t.citationCount),
    index("venue_idx").on(t.venue), // Fast queries by journal/conference
    // Validate DOI format if provided
    check(
      "valid_doi",
      sql`${t.doi} IS NULL OR ${t.doi} ~* '^10\.[0-9]{4,}(\.[0-9]+)*\/[-._;()/:A-Z0-9]+$'`
    ),
    // Ensure venue is provided for main types
    check(
      "main_types_need_venue",
      sql`${t.type} NOT IN ('journal_article', 'conference_paper') OR ${t.venue} IS NOT NULL`
    ),
    // URL format validation
    check("valid_url", sql`${t.link} IS NULL OR ${t.link} ~* '^https?:\/\/'`),
  ]
);
