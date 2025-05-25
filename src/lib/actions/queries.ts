"use server";

import {
  getFormattedResearchAreas,
  getProjects,
  getResearchAreas,
  getResearchFrameworks,
  getResearchMethodologies,
} from "@/lib/queries/admin";

export type ResearchAreasData = Awaited<
  ReturnType<typeof getFormattedResearchAreas>
>;
export type AdminAreasData = Awaited<ReturnType<typeof getResearchAreas>>;
export type AdminFrameworksData = Awaited<
  ReturnType<typeof getResearchFrameworks>
>;
export type AdminMethodologiesData = Awaited<
  ReturnType<typeof getResearchMethodologies>
>;
export type AdminProjectsData = Awaited<ReturnType<typeof getProjects>>;
