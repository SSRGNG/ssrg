"use server";

import {
  getProjects,
  getResearchAreas,
  getResearchers,
  getResearchFrameworks,
  getResearchMethodologies,
} from "@/lib/queries/admin";
import {
  authResearcher,
  getCurrentUserResearcher,
  getNonResearchers,
  getPublications,
  getResearcherPublications,
  researcherPublications,
} from "@/lib/queries/portal";

export type AdminAreasData = Awaited<ReturnType<typeof getResearchAreas>>;
export type AdminFrameworksData = Awaited<
  ReturnType<typeof getResearchFrameworks>
>;
export type AdminMethodologiesData = Awaited<
  ReturnType<typeof getResearchMethodologies>
>;
export type AdminProjectsData = Awaited<ReturnType<typeof getProjects>>;
export type PortalPublications = Awaited<ReturnType<typeof getPublications>>;

export type PortalResearcherPubs = Awaited<
  ReturnType<typeof getResearcherPublications>
>;
export type AuthResearcher = Awaited<ReturnType<typeof authResearcher>>;
export type CurrentResearcherRes = Awaited<
  ReturnType<typeof getCurrentUserResearcher>
>;
export type NonResearchers = Awaited<ReturnType<typeof getNonResearchers>>;
export type ResearchersWithRelations = Awaited<
  ReturnType<typeof getResearchers>
>;
export type ResearcherWithPublications = Awaited<
  ReturnType<typeof researcherPublications>
>;
