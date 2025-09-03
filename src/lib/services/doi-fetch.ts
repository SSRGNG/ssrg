import { PublicationType } from "@/types";

export interface DOIPublicationData {
  title?: string;
  abstract?: string;
  authors?: Array<{
    name: string;
    orcid?: string;
    affiliation?: string;
  }>;
  publicationDate?: string;
  doi: string;
  venue?: string;
  type?: PublicationType;
  metadata?: {
    // Journal specific
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;

    // Conference specific
    conferenceName?: string;
    conferenceLocation?: string;
    conferenceDate?: string;

    // Book chapter specific
    bookTitle?: string;
    publisher?: string;
    city?: string;
    isbn?: string;

    // Report specific
    organization?: string;
    reportNumber?: string;
  };
}

// Crossref API types
interface CrossrefAuthor {
  given?: string;
  family?: string;
  ORCID?: string;
  affiliation?: Array<{ name: string }>;
}

interface CrossrefEvent {
  name?: string;
  location?: string;
}

interface CrossrefDateParts {
  "date-parts": number[][];
}

interface CrossrefWork {
  DOI: string;
  title?: string[];
  abstract?: string;
  author?: CrossrefAuthor[];
  "published-print"?: CrossrefDateParts;
  "published-online"?: CrossrefDateParts;
  type: string;
  "container-title"?: string[];
  publisher?: string;
  volume?: string;
  issue?: string;
  page?: string;
  event?: CrossrefEvent;
}

// DataCite API types
interface DataCiteNameIdentifier {
  nameIdentifier: string;
  nameIdentifierScheme: string;
}

interface DataCiteCreator {
  name?: string;
  givenName?: string;
  familyName?: string;
  nameIdentifiers?: DataCiteNameIdentifier[];
  affiliation?: Array<{ name: string }>;
}

interface DataCiteDescription {
  description: string;
  descriptionType: string;
}

interface DataCiteTitle {
  title: string;
}

interface DataCiteTypes {
  resourceType?: string;
}

interface DataCiteContainer {
  title?: string;
}

interface DataCiteAttributes {
  doi: string;
  titles?: DataCiteTitle[];
  descriptions?: DataCiteDescription[];
  creators?: DataCiteCreator[];
  publicationYear?: number;
  types?: DataCiteTypes;
  container?: DataCiteContainer;
  publisher?: string;
}

interface DataCiteWork {
  attributes: DataCiteAttributes;
}

class DOIFetchService {
  private readonly crossrefBaseUrl = "https://api.crossref.org/works/";
  private readonly dataciteBaseUrl = "https://api.datacite.org/dois/";

  /**
   * Fetch publication data by DOI from multiple sources
   */
  async fetchByDOI(doi: string): Promise<{
    success: boolean;
    data?: DOIPublicationData;
    error?: string;
    source?: "crossref" | "datacite";
  }> {
    try {
      const cleanDoi = this.cleanDOI(doi);
      if (!this.isValidDOI(cleanDoi)) {
        return {
          success: false,
          error: "Invalid DOI format",
        };
      }

      // Try Crossref first (most common for academic publications)
      const crossrefResult = await this.fetchFromCrossref(cleanDoi);
      if (crossrefResult.success && crossrefResult.data) {
        return { ...crossrefResult, source: "crossref" };
      }

      // Fallback to DataCite (common for datasets, reports, etc.)
      const dataciteResult = await this.fetchFromDataCite(cleanDoi);
      if (dataciteResult.success && dataciteResult.data) {
        return { ...dataciteResult, source: "datacite" };
      }

      return {
        success: false,
        error: "Publication not found in Crossref or DataCite databases",
      };
    } catch (error) {
      console.error("DOI fetch error:", error);
      return {
        success: false,
        error: "Failed to fetch publication data",
      };
    }
  }

  private async fetchFromCrossref(doi: string): Promise<{
    success: boolean;
    data?: DOIPublicationData;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.crossrefBaseUrl}${doi}`, {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "ResearchApp/1.0 (mailto:ssrg@socialsolutionsresearchgroup.org)",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: "DOI not found in Crossref" };
        }
        throw new Error(`Crossref API error: ${response.status}`);
      }

      const result = await response.json();
      const work = result.message;

      return {
        success: true,
        data: this.parseCrossrefData(work),
      };
    } catch (error) {
      console.error("Crossref fetch error:", error);
      return {
        success: false,
        error: "Failed to fetch from Crossref",
      };
    }
  }

  private async fetchFromDataCite(doi: string): Promise<{
    success: boolean;
    data?: DOIPublicationData;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.dataciteBaseUrl}${doi}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: "DOI not found in DataCite" };
        }
        throw new Error(`DataCite API error: ${response.status}`);
      }

      const result = await response.json();
      const work = result.data;

      return {
        success: true,
        data: this.parseDataCiteData(work),
      };
    } catch (error) {
      console.error("DataCite fetch error:", error);
      return {
        success: false,
        error: "Failed to fetch from DataCite",
      };
    }
  }

  private parseCrossrefData(work: CrossrefWork): DOIPublicationData {
    const data: DOIPublicationData = {
      doi: work.DOI,
      title: work.title?.[0] || "",
      abstract: work.abstract || "",
    };

    // Parse publication date
    if (work["published-print"]?.["date-parts"]?.[0]) {
      const dateParts = work["published-print"]["date-parts"][0];
      data.publicationDate = this.formatDate(dateParts);
    } else if (work["published-online"]?.["date-parts"]?.[0]) {
      const dateParts = work["published-online"]["date-parts"][0];
      data.publicationDate = this.formatDate(dateParts);
    }

    // Determine publication type and venue
    const type = work.type;
    if (type === "journal-article") {
      data.type = "journal_article";
      data.venue = work["container-title"]?.[0] || "";
      data.metadata = {
        journal: work["container-title"]?.[0] || "",
        volume: work.volume || "",
        issue: work.issue || "",
        pages: work.page || "",
      };
    } else if (type === "proceedings-article") {
      data.type = "conference_paper";
      data.venue = work["container-title"]?.[0] || work.event?.name || "";
      data.metadata = {
        conferenceName: work["container-title"]?.[0] || work.event?.name || "",
        conferenceLocation: work.event?.location || "",
      };
    } else if (type === "book-chapter") {
      data.type = "book_chapter";
      data.venue = work["container-title"]?.[0] || "";
      data.metadata = {
        bookTitle: work["container-title"]?.[0] || "",
        publisher: work.publisher || "",
        pages: work.page || "",
      };
    } else {
      // Default to journal article for unknown types
      data.type = "journal_article";
      data.venue = work["container-title"]?.[0] || work.publisher || "";
    }

    // Parse authors
    if (work.author && Array.isArray(work.author)) {
      data.authors = work.author.map((author: CrossrefAuthor) => ({
        name: `${author.given || ""} ${author.family || ""}`.trim(),
        // orcid: author.ORCID
        //   ? author.ORCID.replace("http://orcid.org/", "")
        //   : undefined,
        orcid: author.ORCID ? this.cleanORCID(author.ORCID) : undefined,
        affiliation: author.affiliation?.[0]?.name || "",
      }));
    }

    return data;
  }

  private parseDataCiteData(work: DataCiteWork): DOIPublicationData {
    const attributes = work.attributes;

    const data: DOIPublicationData = {
      doi: attributes.doi,
      title: attributes.titles?.[0]?.title || "",
      abstract:
        attributes.descriptions?.find(
          (d: DataCiteDescription) => d.descriptionType === "Abstract"
        )?.description || "",
    };

    // Parse publication date
    if (attributes.publicationYear) {
      data.publicationDate = attributes.publicationYear.toString();
    }

    // Determine type - DataCite uses different resource types
    const resourceType = attributes.types?.resourceType?.toLowerCase();
    if (resourceType?.includes("article")) {
      data.type = "journal_article";
    } else if (
      resourceType?.includes("conference") ||
      resourceType?.includes("presentation")
    ) {
      data.type = "conference_paper";
    } else if (
      resourceType?.includes("book") ||
      resourceType?.includes("chapter")
    ) {
      data.type = "book_chapter";
    } else if (resourceType?.includes("report")) {
      data.type = "report";
    } else {
      data.type = "journal_article"; // Default
    }

    // Set venue
    data.venue = attributes.container?.title || attributes.publisher || "";

    // Parse authors/creators
    if (attributes.creators && Array.isArray(attributes.creators)) {
      data.authors = attributes.creators.map((creator: DataCiteCreator) => ({
        name:
          creator.name ||
          `${creator.givenName || ""} ${creator.familyName || ""}`.trim(),
        // orcid: creator.nameIdentifiers
        //   ?.find((id: DataCiteNameIdentifier) => id.nameIdentifierScheme === "ORCID")
        //   ?.nameIdentifier?.replace("https://orcid.org/", ""),
        orcid: creator.nameIdentifiers?.find(
          (id: DataCiteNameIdentifier) => id.nameIdentifierScheme === "ORCID"
        )?.nameIdentifier
          ? this.cleanORCID(
              creator.nameIdentifiers.find(
                (id: DataCiteNameIdentifier) =>
                  id.nameIdentifierScheme === "ORCID"
              )!.nameIdentifier
            )
          : undefined,
        affiliation: creator.affiliation?.[0]?.name || "",
      }));
    }

    return data;
  }

  private cleanDOI(doi: string): string {
    // Remove common prefixes and clean up the DOI
    return doi
      .replace(/^(https?:\/\/)?(dx\.)?doi\.org\//, "")
      .replace(/^doi:/, "")
      .trim();
  }

  private cleanORCID(orcid: string): string {
    // Remove ORCID URL prefixes to get just the ID
    return orcid
      .replace(/^https?:\/\/orcid\.org\//, "")
      .replace(/^orcid\.org\//, "")
      .trim();
  }

  private isValidDOI(doi: string): boolean {
    // Basic DOI format validation
    const doiRegex = /^10\.\d{4,}\/[-._;()\/:A-Za-z0-9]+$/;
    return doiRegex.test(doi);
  }

  private formatDate(dateParts: number[]): string {
    const [year, month, day] = dateParts;
    if (day)
      return `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    if (month) return `${year}-${month.toString().padStart(2, "0")}`;
    return year.toString();
  }
}

export const doiFetchService = new DOIFetchService();
