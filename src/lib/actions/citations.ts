"use server";

import {
  doiFetchService,
  type DOIPublicationData,
} from "@/lib/services/doi-fetch";

export async function getCitationCount(doi: string): Promise<number | null> {
  try {
    const count = await fetchOpenCitationsCount(doi);
    if (count !== null) return count;

    // Fallback to Crossref
    const fallback = await fetchCrossrefCitationCount(doi);
    return fallback;
  } catch (error) {
    console.error("Error getting citation count:", error);
    return null;
  }
}

async function fetchOpenCitationsCount(doi: string): Promise<number | null> {
  const url = `https://opencitations.net/index/api/v2/citation-count/doi:${encodeURIComponent(
    doi
  )}`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // Revalidate daily

  if (!res.ok) return null;

  const data = await res.json();
  return data?.count ?? null;
}

async function fetchCrossrefCitationCount(doi: string): Promise<number | null> {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });

  if (!res.ok) return null;

  const json = await res.json();
  const count = json?.message?.["is-referenced-by-count"];
  return typeof count === "number" ? count : null;
}

export async function fetchPublicationByDOI(doi: string): Promise<{
  success: boolean;
  data?: DOIPublicationData;
  error?: string;
  source?: "crossref" | "datacite";
}> {
  try {
    if (!doi || typeof doi !== "string") {
      return {
        success: false,
        error: "DOI is required",
      };
    }

    const result = await doiFetchService.fetchByDOI(doi);
    return result;
  } catch (error) {
    console.error("Server action DOI fetch error:", error);
    return {
      success: false,
      error: "Failed to fetch publication data",
    };
  }
}
// 10.1177/2333721420986301
