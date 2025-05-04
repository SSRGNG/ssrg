// import { Event, Partner, PresenterRole, Role } from "@/types";
// import { relations, sql } from "drizzle-orm";
// import {
//   boolean,
//   check,
//   index,
//   integer,
//   pgTable,
//   primaryKey,
//   text,
//   timestamp,
//   uuid,
//   varchar,
// } from "drizzle-orm/pg-core";
// import type { AdapterAccountType } from "next-auth/adapters";

// export const users = pgTable(
//   "users",
//   {
//     id: uuid("id").primaryKey().defaultRandom(),
//     name: text("name").notNull(),
//     email: text("email").notNull().unique(),
//     affiliation: varchar("affiliation", { length: 255 }),
//     emailVerified: timestamp("emailVerified", { mode: "date" }),
//     image: text("image"),
//     password: text("password").notNull(),
//     role: varchar("role", { length: 20 })
//       .$type<Role>()
//       .default("member")
//       .notNull(),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//   },
//   (t) => [
//     index("users_role_idx").on(t.role),
//     check(
//       "valid_email",
//       sql`${t.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'`
//     ),
//   ]
// );

// export const accounts = pgTable(
//   "account",
//   {
//     userId: uuid("userId")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     type: text("type").$type<AdapterAccountType>().notNull(),
//     provider: text("provider").notNull(),
//     providerAccountId: text("providerAccountId").notNull(),
//     refresh_token: text("refresh_token"),
//     access_token: text("access_token"),
//     expires_at: integer("expires_at"),
//     token_type: text("token_type"),
//     scope: text("scope"),
//     id_token: text("id_token"),
//     session_state: text("session_state"),
//   },
//   (account) => [
//     primaryKey({
//       columns: [account.provider, account.providerAccountId],
//     }),
//   ]
// );

// export const sessions = pgTable("session", {
//   sessionToken: text("sessionToken").primaryKey(),
//   userId: uuid("userId")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   expires: timestamp("expires", { mode: "date" }).notNull(),
// });

// export const verificationTokens = pgTable(
//   "verificationToken",
//   {
//     identifier: text("identifier").notNull(),
//     token: text("token").notNull(),
//     expires: timestamp("expires", { mode: "date" }).notNull(),
//   },
//   (verificationToken) => [
//     primaryKey({
//       columns: [verificationToken.identifier, verificationToken.token],
//     }),
//   ]
// );

// export const authenticators = pgTable(
//   "authenticator",
//   {
//     credentialID: text("credentialID").notNull().unique(),
//     userId: uuid("userId")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     providerAccountId: text("providerAccountId").notNull(),
//     credentialPublicKey: text("credentialPublicKey").notNull(),
//     counter: integer("counter").notNull(),
//     credentialDeviceType: text("credentialDeviceType").notNull(),
//     credentialBackedUp: boolean("credentialBackedUp").notNull(),
//     transports: text("transports"),
//   },
//   (authenticator) => [
//     primaryKey({
//       columns: [authenticator.userId, authenticator.credentialID],
//     }),
//   ]
// );

// // Researcher-related tables
// export const researchers = pgTable(
//   "researcher",
//   {
//     id: uuid("id").primaryKey().defaultRandom(),
//     userId: uuid("userId")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     title: text("title").notNull(),
//     bio: text("bio").notNull(),
//     x: text("x"),
//     orcid: text("orcid"),
//     featured: boolean("featured").default(false).notNull(),
//     createdAt: timestamp("createdAt").defaultNow().notNull(),
//     updatedAt: timestamp("updatedAt").defaultNow().notNull(),
//   },
//   (t) => [index("researcher_featured_idx").on(t.featured)]
// );

// export const researcherExpertise = pgTable("researcherExpertise", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   researcherId: uuid("researcherId")
//     .notNull()
//     .references(() => researchers.id, { onDelete: "cascade" }),
//   expertise: text("expertise").notNull(),
//   order: integer("order").notNull(),
// });

// export const researcherEducation = pgTable("researcherEducation", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   researcherId: uuid("researcherId")
//     .notNull()
//     .references(() => researchers.id, { onDelete: "cascade" }),
//   education: text("education").notNull(),
//   order: integer("order").notNull(),
// });

// // Publication-related tables
// export const publications = pgTable(
//   "publication",
//   {
//     id: uuid("id").primaryKey().defaultRandom(),
//     title: text("title").notNull(),
//     abstract: text("abstract"),
//     link: text("link"),
//     creatorId: uuid("creatorId").references(() => users.id, {
//       onDelete: "set null",
//     }),
//     publicationDate: timestamp("publicationDate"),
//     journal: varchar("journal", { length: 255 }),
//     volume: varchar("volume", { length: 50 }),
//     issue: varchar("issue", { length: 50 }),
//     pages: varchar("pages", { length: 50 }),
//     doi: varchar("doi", { length: 255 }),
//     isbn: varchar("isbn", { length: 255 }),
//     city: varchar("city", { length: 255 }),
//     publisher: varchar("publisher", { length: 255 }),
//     editedBook: boolean("editedBook"),
//     conferenceName: varchar("conferenceName", { length: 255 }),
//     conferenceLocation: varchar("conferenceLocation", { length: 255 }),
//     conferenceDate: timestamp("conferenceDate"),
//     createdAt: timestamp("createdAt").defaultNow().notNull(),
//     updatedAt: timestamp("updatedAt").defaultNow().notNull(),
//   },
//   (t) => [
//     index("publication_date_idx").on(t.publicationDate),
//     index("publication_doi_idx").on(t.doi),
//   ]
// );

// // Research area-related tables
// export const researchAreas = pgTable("researchArea", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   title: text("title").notNull(),
//   icon: text("icon").notNull(), // Store icon component name
//   image: text("image").notNull(),
//   description: text("description").notNull(),
//   detail: text("detail").notNull(),
//   href: text("href").notNull(),
//   linkText: text("linkText").notNull(),
//   createdAt: timestamp("createdAt").defaultNow().notNull(),
//   updatedAt: timestamp("updatedAt").defaultNow().notNull(),
// });

// export const researchAreaQuestions = pgTable("researchAreaQuestion", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   researchAreaId: uuid("researchAreaId")
//     .notNull()
//     .references(() => researchAreas.id, { onDelete: "cascade" }),
//   question: text("question").notNull(),
//   order: integer("order").notNull(),
// });

// export const researchAreaMethods = pgTable("researchAreaMethod", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   researchAreaId: uuid("researchAreaId")
//     .notNull()
//     .references(() => researchAreas.id, { onDelete: "cascade" }),
//   title: text("title").notNull(),
//   description: text("description").notNull(),
//   order: integer("order").notNull(),
// });

// export const researchAreaFindings = pgTable("researchAreaFinding", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   researchAreaId: uuid("researchAreaId")
//     .notNull()
//     .references(() => researchAreas.id, { onDelete: "cascade" }),
//   finding: text("finding").notNull(),
//   order: integer("order").notNull(),
// });

// export const researchMethodologies = pgTable("researchMethodology", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   title: text("title").notNull(),
//   description: text("description").notNull(),
//   order: integer("order").notNull(),
//   createdAt: timestamp("createdAt").defaultNow().notNull(),
//   updatedAt: timestamp("updatedAt").defaultNow().notNull(),
// });

// export const researchFramework = pgTable("researchFramework", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   title: text("title").notNull(),
//   description: text("description").notNull(),
//   linkText: text("linkText").notNull(),
//   href: text("href").notNull(),
//   order: integer("order").notNull(),
//   createdAt: timestamp("createdAt").defaultNow().notNull(),
//   updatedAt: timestamp("updatedAt").defaultNow().notNull(),
// });

// // Project-related tables
// export const projects = pgTable("project", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   title: text("title").notNull(),
//   description: text("description").notNull(),
//   period: text("period").notNull(),
//   leadResearcherId: uuid("leadResearcherId")
//     .notNull()
//     .references(() => researchers.id, { onDelete: "restrict" }),
//   location: text("location").notNull(),
//   href: text("href").notNull(),
//   image: text("image").notNull(),
//   createdAt: timestamp("createdAt").defaultNow().notNull(),
//   updatedAt: timestamp("updatedAt").defaultNow().notNull(),
// });

// // Partners and events
// export const partners = pgTable("partner", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   name: text("name").notNull(),
//   logo: text("logo"),
//   website: text("website"),
//   description: text("description").notNull(),
//   partnerType: varchar("partnerType", { length: 50 })
//     .$type<Partner>()
//     .notNull(), // e.g., "academic", "nonprofit", "government"
//   featured: boolean("featured").notNull().default(false),
//   createdAt: timestamp("createdAt").defaultNow().notNull(),
//   updatedAt: timestamp("updatedAt").defaultNow().notNull(),
// });

// export const scholarships = pgTable("scholarship", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   title: text("title").notNull(),
//   description: text("description").notNull(),
//   eligibility: text("eligibility").notNull(),
//   amount: text("amount"),
//   deadline: timestamp("deadline"),
//   applicationLink: text("applicationLink"),
//   active: boolean("active").default(true),
//   createdAt: timestamp("createdAt").defaultNow().notNull(),
//   updatedAt: timestamp("updatedAt").defaultNow().notNull(),
// });

// export const events = pgTable(
//   "event",
//   {
//     id: uuid("id").primaryKey().defaultRandom(),
//     title: text("title").notNull(),
//     description: text("description").notNull(),
//     eventType: varchar("eventType", { length: 50 }).$type<Event>().notNull(), // e.g., "workshop", "seminar", "conference"
//     startDate: timestamp("startDate").notNull(),
//     endDate: timestamp("endDate"),
//     location: text("location"),
//     virtualLink: text("virtualLink"),
//     image: text("image"),
//     registrationLink: text("registrationLink"),
//     createdAt: timestamp("createdAt").defaultNow().notNull(),
//     updatedAt: timestamp("updatedAt").defaultNow().notNull(),
//   },
//   (t) => [
//     index("event_start_date_idx").on(t.startDate),
//     index("event_type_idx").on(t.eventType),
//     check(
//       "valid_date_range",
//       sql`${t.endDate} IS NULL OR ${t.startDate} <= ${t.endDate}`
//     ),
//   ]
// );

// export const eventPresenters = pgTable(
//   "eventPresenter",
//   {
//     eventId: uuid("eventId")
//       .notNull()
//       .references(() => events.id, { onDelete: "cascade" }),
//     researcherId: uuid("researcherId").references(() => researchers.id, {
//       onDelete: "set null",
//     }),
//     externalName: text("externalName"),
//     externalAffiliation: text("externalAffiliation"),
//     role: text("role").$type<PresenterRole>().notNull(), // e.g., "keynote", "panelist", "presenter"
//     order: integer("order").notNull(),
//   },
//   (t) => [
//     // Ensure we have at least a researcher ID or external name
//     check(
//       "valid_presenter",
//       sql`${t.researcherId} IS NOT NULL OR ${t.externalName} IS NOT NULL`
//     ),
//   ]
// );

// // Junction/join/bridge/many-to-many tables
// export const publicationAuthors = pgTable(
//   "publicationAuthor",
//   {
//     publicationId: uuid("publicationId")
//       .notNull()
//       .references(() => publications.id, { onDelete: "cascade" }),
//     researcherId: uuid("researcherId")
//       .notNull()
//       .references(() => researchers.id, { onDelete: "cascade" }),
//     order: integer("order").notNull(), // To maintain author ordering
//     contribution: text("contribution"),
//   },
//   (t) => [
//     primaryKey({ columns: [t.publicationId, t.researcherId] }),
//     index("pub_author_order_idx").on(t.publicationId, t.order),
//   ]
// );

// export const projectCategories = pgTable(
//   "projectCategory",
//   {
//     projectId: uuid("projectId")
//       .notNull()
//       .references(() => projects.id, { onDelete: "cascade" }),
//     areaId: uuid("areaId")
//       .notNull()
//       .references(() => researchAreas.id, { onDelete: "cascade" }),
//   },
//   (t) => [primaryKey({ columns: [t.projectId, t.areaId] })]
// );

// export const partnerProjects = pgTable(
//   "partnerProject",
//   {
//     partnerId: uuid("partnerId")
//       .notNull()
//       .references(() => partners.id, { onDelete: "cascade" }),
//     projectId: uuid("projectId")
//       .notNull()
//       .references(() => projects.id, { onDelete: "cascade" }),
//   },
//   (t) => [primaryKey({ columns: [t.partnerId, t.projectId] })]
// );

// export const researcherAreas = pgTable(
//   "researcherArea",
//   {
//     researcherId: uuid("researcherId")
//       .notNull()
//       .references(() => researchers.id, { onDelete: "cascade" }),
//     areaId: uuid("areaId")
//       .notNull()
//       .references(() => researchAreas.id, { onDelete: "cascade" }),
//   },
//   (t) => [primaryKey({ columns: [t.researcherId, t.areaId] })]
// );

// export const researchAreaPublications = pgTable(
//   "researchAreaPublication",
//   {
//     researchAreaId: uuid("researchAreaId")
//       .notNull()
//       .references(() => researchAreas.id, { onDelete: "cascade" }),
//     publicationId: uuid("publicationId")
//       .notNull()
//       .references(() => publications.id, { onDelete: "cascade" }),
//     order: integer("order").notNull(),
//   },
//   (t) => [primaryKey({ columns: [t.researchAreaId, t.publicationId] })]
// );

// export const notifications = pgTable("notification", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   userId: uuid("userId").references(() => users.id, { onDelete: "set null" }),
//   email: text("email").notNull().unique(),
//   token: text("token").notNull().unique(),
//   referredBy: uuid("referredBy").references(() => users.id, {
//     onDelete: "set null",
//   }),
//   communication: boolean("communication").default(false).notNull(),
//   newsletter: boolean("newsletter").default(false).notNull(),
//   marketing: boolean("marketing").default(false).notNull(),
//   createdAt: timestamp("createdAt").defaultNow().notNull(),
//   updatedAt: timestamp("updatedAt").defaultNow().notNull(),
// });

// // Relations
// export const usersRelations = relations(users, ({ one, many }) => ({
//   researcher: one(researchers, {
//     fields: [users.id],
//     references: [researchers.userId],
//   }),
//   createdPublications: many(publications, {
//     relationName: "creator",
//   }),
//   accounts: many(accounts),
//   sessions: many(sessions),
//   authenticators: many(authenticators),
// }));

// export const publicationsRelations = relations(
//   publications,
//   ({ many, one }) => ({
//     authors: many(publicationAuthors),
//     createdBy: one(users, {
//       fields: [publications.creatorId],
//       references: [users.id],
//       relationName: "creator",
//     }),
//     researchAreas: many(researchAreaPublications),
//   })
// );

// export const publicationAuthorsRelations = relations(
//   publicationAuthors,
//   ({ one }) => ({
//     publication: one(publications, {
//       fields: [publicationAuthors.publicationId],
//       references: [publications.id],
//     }),
//     researcher: one(researchers, {
//       fields: [publicationAuthors.researcherId],
//       references: [researchers.id],
//     }),
//   })
// );

// export const researchAreasRelations = relations(researchAreas, ({ many }) => ({
//   questions: many(researchAreaQuestions),
//   methods: many(researchAreaMethods),
//   findings: many(researchAreaFindings),
//   researchers: many(researcherAreas),
//   publications: many(researchAreaPublications),
//   projects: many(projectCategories),
// }));

// export const projectsRelations = relations(projects, ({ many, one }) => ({
//   leadResearcher: one(researchers, {
//     fields: [projects.leadResearcherId],
//     references: [researchers.id],
//   }),
//   categories: many(projectCategories),
//   partners: many(partnerProjects),
// }));

// export const researchersRelations = relations(researchers, ({ many, one }) => ({
//   user: one(users, {
//     fields: [researchers.userId],
//     references: [users.id],
//   }),
//   expertise: many(researcherExpertise),
//   education: many(researcherEducation),
//   areas: many(researcherAreas),
//   publications: many(publicationAuthors),
//   leadProjects: many(projects, {
//     relationName: "leadProjects",
//   }),
// }));

// export const partnersRelations = relations(partners, ({ many }) => ({
//   projects: many(partnerProjects),
// }));

// export const researcherAreasRelations = relations(
//   researcherAreas,
//   ({ one }) => ({
//     researcher: one(researchers, {
//       fields: [researcherAreas.researcherId],
//       references: [researchers.id],
//     }),
//     area: one(researchAreas, {
//       fields: [researcherAreas.areaId],
//       references: [researchAreas.id],
//     }),
//   })
// );

// export const researchAreaPublicationsRelations = relations(
//   researchAreaPublications,
//   ({ one }) => ({
//     area: one(researchAreas, {
//       fields: [researchAreaPublications.researchAreaId],
//       references: [researchAreas.id],
//     }),
//     publication: one(publications, {
//       fields: [researchAreaPublications.publicationId],
//       references: [publications.id],
//     }),
//   })
// );

// export const eventsRelations = relations(events, ({ many }) => ({
//   presenters: many(eventPresenters),
// }));

// export const eventPresentersRelations = relations(
//   eventPresenters,
//   ({ one }) => ({
//     event: one(events, {
//       fields: [eventPresenters.eventId],
//       references: [events.id],
//     }),
//     researcher: one(researchers, {
//       fields: [eventPresenters.researcherId],
//       references: [researchers.id],
//     }),
//   })
// );
