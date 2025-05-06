"use server";

import { getCachedResearchAreas } from "@/lib/queries/admin";

export type ResearchAreasData = Awaited<
  ReturnType<typeof getCachedResearchAreas>
>;
