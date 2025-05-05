import {
  accounts,
  authenticators,
  eventPresenters,
  events,
  partnerProjects,
  partners,
  projectCategories,
  projects,
  publicationAuthors,
  publications,
  researchAreaFindings,
  researchAreaMethods,
  researchAreaPublications,
  researchAreaQuestions,
  researchAreas,
  researcherAreas,
  researcherEducation,
  researcherExpertise,
  researchers,
  sessions,
  users,
} from "@/db/schema";
import { relations } from "drizzle-orm";

// auth
export const authRelations = relations(users, ({ one, many }) => ({
  researcher: one(researchers, {
    fields: [users.id],
    references: [researchers.userId],
  }),
  createdPublications: many(publications, {
    relationName: "creator",
  }),
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
export const authenticatorRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));

// events
export const eventsRelations = relations(events, ({ many }) => ({
  presenters: many(eventPresenters),
}));

export const eventPresentersRelations = relations(
  eventPresenters,
  ({ one }) => ({
    event: one(events, {
      fields: [eventPresenters.eventId],
      references: [events.id],
    }),
    researcher: one(researchers, {
      fields: [eventPresenters.researcherId],
      references: [researchers.id],
    }),
  })
);

// partners
export const partnersRelations = relations(partners, ({ many }) => ({
  projects: many(partnerProjects),
}));

// projects
export const projectsRelations = relations(projects, ({ many, one }) => ({
  leadResearcher: one(researchers, {
    fields: [projects.leadResearcherId],
    references: [researchers.id],
    relationName: "lead",
  }),
  categories: many(projectCategories),
  partners: many(partnerProjects),
}));

export const projectCategoriesRelations = relations(
  projectCategories,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectCategories.projectId],
      references: [projects.id],
    }),
    area: one(researchAreas, {
      fields: [projectCategories.areaId],
      references: [researchAreas.id],
    }),
  })
);

export const partnerProjectsRelations = relations(
  partnerProjects,
  ({ one }) => ({
    partner: one(partners, {
      fields: [partnerProjects.partnerId],
      references: [partners.id],
    }),
    project: one(projects, {
      fields: [partnerProjects.projectId],
      references: [projects.id],
    }),
  })
);

// publications
export const publicationsRelations = relations(
  publications,
  ({ many, one }) => ({
    authors: many(publicationAuthors),
    createdBy: one(users, {
      fields: [publications.creatorId],
      references: [users.id],
      relationName: "creator",
    }),
    researchAreas: many(researchAreaPublications),
  })
);

export const publicationAuthorsRelations = relations(
  publicationAuthors,
  ({ one }) => ({
    publication: one(publications, {
      fields: [publicationAuthors.publicationId],
      references: [publications.id],
    }),
    researcher: one(researchers, {
      fields: [publicationAuthors.researcherId],
      references: [researchers.id],
    }),
  })
);

export const researchAreaPublicationsRelations = relations(
  researchAreaPublications,
  ({ one }) => ({
    area: one(researchAreas, {
      fields: [researchAreaPublications.researchAreaId],
      references: [researchAreas.id],
    }),
    publication: one(publications, {
      fields: [researchAreaPublications.publicationId],
      references: [publications.id],
    }),
  })
);

// research
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

// researchers
export const researchersRelations = relations(researchers, ({ one, many }) => ({
  user: one(users, {
    fields: [researchers.userId],
    references: [users.id],
  }),
  expertise: many(researcherExpertise),
  education: many(researcherEducation),

  areas: many(researcherAreas),
  publications: many(publicationAuthors),
  leadProjects: many(projects, {
    relationName: "lead",
  }),
}));

export const researcherExpertiseRelations = relations(
  researcherExpertise,
  ({ one }) => ({
    researcher: one(researchers, {
      fields: [researcherExpertise.researcherId],
      references: [researchers.id],
    }),
  })
);

export const researcherEducationRelations = relations(
  researcherEducation,
  ({ one }) => ({
    researcher: one(researchers, {
      fields: [researcherEducation.researcherId],
      references: [researchers.id],
    }),
  })
);

export const researcherAreasRelations = relations(
  researcherAreas,
  ({ one }) => ({
    researcher: one(researchers, {
      fields: [researcherAreas.researcherId],
      references: [researchers.id],
    }),
    area: one(researchAreas, {
      fields: [researcherAreas.areaId],
      references: [researchAreas.id],
    }),
  })
);
