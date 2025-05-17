"use server";

import {
  getFormattedResearchAreas,
  getResearchAreas,
} from "@/lib/queries/admin";

export type ResearchAreasData = Awaited<
  ReturnType<typeof getFormattedResearchAreas>
>;
export type AdminAreasData = Awaited<ReturnType<typeof getResearchAreas>>;
