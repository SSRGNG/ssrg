"use server";

export async function getCitationCount(doi: string): Promise<number | null> {
  try {
    const count = await fetchOpenCitationsCount(doi);
    if (count !== null) return count;

    // Fallback to Crossref (note: Crossref doesn't always provide citation count)
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
  // return Array.isArray(data) ? data.length : null
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

// 10.1177/2333721420986301
