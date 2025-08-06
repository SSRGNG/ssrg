import { relations } from "drizzle-orm";

import {
  accounts,
  authenticators,
  authors,
  eventPresenters,
  events,
  partnerProjects,
  partners,
  projectCategories,
  projectMembers,
  projectMilestones,
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
  videoAuthors,
  videos,
} from "@/db/schema";

// auth
export const authRelations = relations(users, ({ one, many }) => ({
  researcher: one(researchers, {
    fields: [users.id],
    references: [researchers.userId],
  }),
  createdVideos: many(videos, {
    relationName: "videoCreator",
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

// authors
export const authorsRelations = relations(authors, ({ one, many }) => ({
  // Link to internal researcher (optional)
  researcher: one(researchers, {
    fields: [authors.researcherId],
    references: [researchers.id],
  }),
  // Publications this author has contributed to
  publications: many(publicationAuthors, { relationName: "auth_pubs" }),
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
  // Lead researcher relation
  leadResearcher: one(researchers, {
    fields: [projects.leadResearcherId],
    references: [researchers.id],
    relationName: "lead",
  }),
  // Creator relation
  creator: one(users, {
    fields: [projects.creatorId],
    references: [users.id],
  }),
  // Research area categories (from junction table)
  categories: many(projectCategories),
  // Partner projects (from junction table)
  partners: many(partnerProjects),
  // Team members
  members: many(projectMembers),
  // Milestones
  milestones: many(projectMilestones),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  researcher: one(researchers, {
    fields: [projectMembers.researcherId],
    references: [researchers.id],
  }),
}));

export const projectMilestonesRelations = relations(
  projectMilestones,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectMilestones.projectId],
      references: [projects.id],
    }),
  })
);

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
    authors: many(publicationAuthors, { relationName: "pub_auths" }),
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
      relationName: "pub_auths",
    }),
    author: one(authors, {
      // Changed from researcher to author
      fields: [publicationAuthors.authorId],
      references: [authors.id],
      relationName: "auth_pubs",
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
  author: one(authors, {
    fields: [researchers.id],
    references: [authors.researcherId],
  }),

  leadProjects: many(projects, {
    relationName: "lead",
  }),
  videos: many(videoAuthors, {
    relationName: "authorVideos",
  }),
  eventPresentations: many(eventPresenters),
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

// Video relations
export const videosRelations = relations(videos, ({ one, many }) => ({
  // Creator relation
  creator: one(users, {
    fields: [videos.creatorId],
    references: [users.id],
    relationName: "videoCreator",
  }),
  // Authors relation
  authors: many(videoAuthors, {
    relationName: "videoAuthors",
  }),
}));

// Video authors junction table relations
export const videoAuthorsRelations = relations(videoAuthors, ({ one }) => ({
  video: one(videos, {
    fields: [videoAuthors.videoId],
    references: [videos.id],
    relationName: "videoAuthors",
  }),
  author: one(authors, {
    fields: [videoAuthors.authorId],
    references: [authors.id],
    relationName: "authorVideos",
  }),
}));
