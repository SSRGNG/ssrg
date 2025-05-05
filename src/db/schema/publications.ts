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

// Publication type enum to better categorize publications
// export const publicationTypeEnum = pgEnum("publication_type", [
//   "journal_article",
//   "conference_paper",
//   "book",
//   "book_chapter",
//   "report",
//   "thesis",
//   "other",
// ]);

// Publications table
export const publications = pgTable(
  "publications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    abstract: text("abstract"),
    link: varchar("link", { length: 500 }),
    creatorId: uuid("creator_id").references(() => users.id, {
      onDelete: "set null",
    }),
    publicationDate: timestamp("publication_date"),
    // Journal-specific fields
    journal: varchar("journal", { length: 255 }),
    volume: varchar("volume", { length: 50 }),
    issue: varchar("issue", { length: 50 }),
    pages: varchar("pages", { length: 50 }),
    // Identifiers
    doi: varchar("doi", { length: 255 }),
    isbn: varchar("isbn", { length: 20 }),
    // Book-specific fields
    city: varchar("city", { length: 255 }),
    publisher: varchar("publisher", { length: 255 }),
    editedBook: boolean("edited_book"),
    // Conference-specific fields
    conferenceName: varchar("conference_name", { length: 255 }),
    conferenceLocation: varchar("conference_location", { length: 255 }),
    conferenceDate: timestamp("conference_date"),
    // Metadata
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("publication_date_idx").on(t.publicationDate),
    index("publication_doi_idx").on(t.doi),
    // Validate DOI format if provided
    // check(
    //   "valid_doi",
    //   sql`${t.doi} IS NULL OR ${t.doi} ~* '^10\.[0-9]{4,}(\.[0-9]+)*\/[-._;()/:A-Z0-9]+$'`
    // ),
    // // Validate ISBN format if provided
    // check(
    //   "valid_isbn",
    //   sql`${t.isbn} IS NULL OR ${t.isbn} ~* '^(97(8|9)-?)?\d{9}(\d|X)$'`
    // ),
    // Validate URL format if provided
    // check(
    //   "valid_link",
    //   sql`${t.link} IS NULL OR ${t.link} ~* '^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$'`
    // ),
  ]
);
