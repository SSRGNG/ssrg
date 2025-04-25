import { Role } from "@/types";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  affiliation: varchar("affiliation", { length: 255 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 })
    .$type<Role>()
    .default("member")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  ]
);

export const publications = pgTable(
  "publication",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    abstract: text("abstract"),
    link: text("link"),
    leadAuthorId: uuid("leadAuthorId").references(() => users.id),
    creatorId: uuid("creatorId").references(() => users.id),
    publicationDate: timestamp("publicationDate"),
    journal: varchar("journal", { length: 255 }),
    volume: varchar("volume", { length: 50 }),
    issue: varchar("issue", { length: 50 }),
    pages: varchar("pages", { length: 50 }),
    doi: varchar("doi", { length: 255 }),
    isbn: varchar("isbn", { length: 255 }),
    city: varchar("city", { length: 255 }),
    publisher: varchar("publisher", { length: 255 }),
    editedBook: boolean("editedBook"),
    conferenceName: varchar("conferenceName", { length: 255 }),
    conferenceLocation: varchar("conferenceLocation", { length: 255 }),
    conferenceDate: timestamp("conferenceDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("lead_authors_user_id_idx").on(table.leadAuthorId)]
);

export const publicationAuthors = pgTable(
  "publicationAuthor",
  {
    publicationId: uuid("publicationId").references(() => publications.id),
    userId: uuid("userId").references(() => users.id),
    isLeadAuthor: boolean("isLeadAuthor").default(false),
  },
  (t) => [primaryKey({ columns: [t.publicationId, t.userId] })]
);

export const notifications = pgTable("notification", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId"),
  email: text("email").notNull().unique(),
  token: text("token").notNull().unique(),
  referredBy: uuid("referredBy"),
  communication: boolean("communication").default(false).notNull(),
  newsletter: boolean("newsletter").default(false).notNull(),
  marketing: boolean("marketing").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  publications: many(publicationAuthors),
}));

export const publicationsRelations = relations(
  publications,
  ({ many, one }) => ({
    authors: many(publicationAuthors),
    createdBy: one(users, {
      fields: [publications.creatorId],
      references: [users.id],
    }),
  })
);

export const publicationAuthorsRelations = relations(
  publicationAuthors,
  ({ one }) => ({
    publication: one(publications, {
      fields: [publicationAuthors.publicationId],
      references: [publications.id],
    }),
    user: one(users, {
      fields: [publicationAuthors.userId],
      references: [users.id],
    }),
  })
);
