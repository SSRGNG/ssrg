import { Publications } from "@/lib/actions/queries";
import { SortOption } from "@/types";

function normalizePublicationDate(dateStr: string | null): number {
  if (!dateStr) return 0; // Treat null as the earliest possible date

  const parts = dateStr.split("-");
  const [year, month = "01", day = "01"] = parts;

  // Ensure valid numbers and fallback
  const normalizedDate = new Date(`${year}-${month}-${day}`);
  return normalizedDate.getTime() || 0;
}

export function filterAndSortPublications(
  publications: Publications,
  // searchTerm?: string,
  sortBy: SortOption = "recent",
  publicationType?: Publications[number]["type"]
): Publications {
  let filtered = publications;

  // Filter by type if specified
  if (publicationType) {
    filtered = filtered.filter((pub) => pub.type === publicationType);
  }

  // Filter by search term
  // if (searchTerm) {
  //   const term = searchTerm.toLowerCase();
  //   filtered = filtered.filter(pub =>
  //     pub.title.toLowerCase().includes(term) ||
  //     pub.authors.some(author => author.toLowerCase().includes(term))
  //   );
  // }

  // Sort publications
  switch (sortBy) {
    case "alphabetical":
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    case "citations":
      return filtered.sort(
        (a, b) => (b.citationCount ?? 0) - (a.citationCount ?? 0)
      );
    case "recent":
    default:
      return filtered.sort(
        (a, b) =>
          normalizePublicationDate(b.publicationDate) -
          normalizePublicationDate(a.publicationDate)
      );
  }
}
