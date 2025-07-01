import { SQL, sql, SQLWrapper } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

import { PortalResearcherPubs } from "@/lib/actions/queries";
import {
  bookChapterMetadataSchema,
  conferenceMetadataSchema,
  genericMetadataSchema,
  journalMetadataSchema,
  reportMetadataSchema,
} from "@/lib/validations/publication";
import {
  BookChapterMetadata,
  ConferenceMetadata,
  Generic,
  JournalMetadata,
  Publication,
  PublicationMetadata,
  PublicationType,
  ReportMetadata,
} from "@/types";
import { z } from "zod";

export function atLeastOneNotNull(...columns: SQLWrapper[]) {
  return sql`${sql.join(
    columns.map((c) => sql`${c} IS NOT NULL`),
    sql` OR `
  )}`;
}

export function lower(title: AnyPgColumn): SQL {
  return sql`lower(${title})`;
}

// Type guards with proper type narrowing
export function isJournalArticle(
  pub: Publication
): pub is Publication & { type: "journal_article" } {
  return pub.type === "journal_article";
}

export function isConferencePaper(
  pub: Publication
): pub is Publication & { type: "conference_paper" } {
  return pub.type === "conference_paper";
}

export function formatInTextCitation(
  authors: PortalResearcherPubs[number]["authors"]
): string {
  if (!authors || authors.length === 0) return "No authors";

  const authorNames = authors.map((author) => {
    const fullName = author.name.trim();
    const nameParts = fullName.split(/\s+/);

    if (nameParts.length === 1) {
      return `${nameParts[0]}`; // Just one name, e.g., "Cher"
    }

    const lastName = nameParts[nameParts.length - 1];
    const initials = nameParts
      .slice(0, -1)
      .map((part) => part[0].toUpperCase() + ".")
      .join(" ");

    return `${lastName}, ${initials}`;
  });

  if (authorNames.length === 1) {
    return authorNames[0];
  } else if (authorNames.length === 2) {
    return `${authorNames[0]} & ${authorNames[1]}`;
  } else {
    // APA style for 3 or more authors
    return `${authorNames[0]} et al.`;
  }
}

// Zod-based type guards - much simpler and more reliable
export function isJournalMetadata(
  metadata: unknown
): metadata is JournalMetadata {
  return journalMetadataSchema.safeParse(metadata).success;
}

export function isConferenceMetadata(
  metadata: unknown
): metadata is ConferenceMetadata {
  return conferenceMetadataSchema.safeParse(metadata).success;
}

export function isBookChapterMetadata(
  metadata: unknown
): metadata is BookChapterMetadata {
  return bookChapterMetadataSchema.safeParse(metadata).success;
}

export function isReportMetadata(
  metadata: unknown
): metadata is ReportMetadata {
  return reportMetadataSchema.safeParse(metadata).success;
}

export function isGenericMetadata(metadata: unknown): metadata is Generic {
  return genericMetadataSchema.safeParse(metadata).success;
}

// Parse and validate metadata with error handling
export function parseMetadata(metadata: unknown): {
  data: PublicationMetadata | null;
  type: PublicationType | "generic" | "invalid";
  errors?: z.ZodError;
} {
  // Try each schema in order of specificity
  const journalResult = journalMetadataSchema.safeParse(metadata);
  if (journalResult.success) {
    return { data: journalResult.data, type: "journal_article" };
  }

  const conferenceResult = conferenceMetadataSchema.safeParse(metadata);
  if (conferenceResult.success) {
    return { data: conferenceResult.data, type: "conference_paper" };
  }

  const bookChapterResult = bookChapterMetadataSchema.safeParse(metadata);
  if (bookChapterResult.success) {
    return { data: bookChapterResult.data, type: "book_chapter" };
  }

  const reportResult = reportMetadataSchema.safeParse(metadata);
  if (reportResult.success) {
    return { data: reportResult.data, type: "report" };
  }

  const genericResult = genericMetadataSchema.safeParse(metadata);
  if (genericResult.success) {
    return { data: genericResult.data, type: "generic" };
  }

  // Return the most specific error (journal schema errors are most informative)
  return {
    data: null,
    type: "invalid",
    errors: journalResult.error,
  };
}

// Safe parsers that return parsed data or null
export function parseJournalMetadata(
  metadata: unknown
): JournalMetadata | null {
  const result = journalMetadataSchema.safeParse(metadata);
  return result.success ? result.data : null;
}

export function parseConferenceMetadata(
  metadata: unknown
): ConferenceMetadata | null {
  const result = conferenceMetadataSchema.safeParse(metadata);
  return result.success ? result.data : null;
}

export function parseBookChapterMetadata(
  metadata: unknown
): BookChapterMetadata | null {
  const result = bookChapterMetadataSchema.safeParse(metadata);
  return result.success ? result.data : null;
}

export function parseReportMetadata(metadata: unknown): ReportMetadata | null {
  const result = reportMetadataSchema.safeParse(metadata);
  return result.success ? result.data : null;
}

// Utility function to safely extract and validate metadata fields
export function extractMetadataFields(metadata: unknown) {
  const parsed = parseMetadata(metadata);

  if (!parsed.data) {
    return { type: "invalid" as const, data: null };
  }

  switch (parsed.type) {
    case "journal_article":
      return {
        type: "journal_article" as const,
        data: parsed.data as JournalMetadata,
        journal: (parsed.data as JournalMetadata).journal,
        volume: (parsed.data as JournalMetadata).volume,
        issue: (parsed.data as JournalMetadata).issue,
        pages: (parsed.data as JournalMetadata).pages,
      };

    case "conference_paper":
      return {
        type: "conference_paper" as const,
        data: parsed.data as ConferenceMetadata,
        conferenceName: (parsed.data as ConferenceMetadata).conferenceName,
        conferenceLocation: (parsed.data as ConferenceMetadata)
          .conferenceLocation,
        conferenceDate: (parsed.data as ConferenceMetadata).conferenceDate,
      };

    case "book_chapter":
      return {
        type: "book_chapter" as const,
        data: parsed.data as BookChapterMetadata,
        bookTitle: (parsed.data as BookChapterMetadata).bookTitle,
        publisher: (parsed.data as BookChapterMetadata).publisher,
        city: (parsed.data as BookChapterMetadata).city,
        isbn: (parsed.data as BookChapterMetadata).isbn,
      };

    case "report":
      return {
        type: "report" as const,
        data: parsed.data as ReportMetadata,
        organization: (parsed.data as ReportMetadata).organization,
        reportNumber: (parsed.data as ReportMetadata).reportNumber,
      };

    default:
      return {
        type: "generic" as const,
        data: parsed.data as Generic,
      };
  }
}

// Enhanced safe field access with Zod validation
export function getMetadataField<T>(
  metadata: unknown,
  field: string,
  defaultValue: T,
  validator?: z.ZodSchema<T>
): T {
  try {
    if (typeof metadata !== "object" || metadata === null) {
      return defaultValue;
    }

    const value = (metadata as Record<string, unknown>)[field];

    if (value === undefined || value === null) {
      return defaultValue;
    }

    // If validator provided, validate the field
    if (validator) {
      const result = validator.safeParse(value);
      return result.success ? result.data : defaultValue;
    }

    return value as T;
  } catch {
    return defaultValue;
  }
}

// Specific getters with full validation
export function getJournalInfo(metadata: unknown) {
  const parsed = parseJournalMetadata(metadata);
  if (!parsed) return null;

  return {
    journal: parsed.journal,
    volume: parsed.volume || "",
    issue: parsed.issue || "",
    pages: parsed.pages || "",
    hasVolumeInfo: Boolean(parsed.volume),
    hasIssueInfo: Boolean(parsed.issue),
    hasPagesInfo: Boolean(parsed.pages),
    // Raw validated data
    rawData: parsed,
  };
}

export function getConferenceInfo(metadata: unknown) {
  const parsed = parseConferenceMetadata(metadata);
  if (!parsed) return null;

  return {
    conferenceName: parsed.conferenceName,
    location: parsed.conferenceLocation || "",
    date: parsed.conferenceDate || "",
    hasLocationInfo: Boolean(parsed.conferenceLocation),
    hasDateInfo: Boolean(parsed.conferenceDate),
    // Raw validated data
    rawData: parsed,
  };
}

export function getBookChapterInfo(metadata: unknown) {
  const parsed = parseBookChapterMetadata(metadata);
  if (!parsed) return null;

  return {
    bookTitle: parsed.bookTitle,
    publisher: parsed.publisher || "",
    city: parsed.city || "",
    isbn: parsed.isbn || "",
    hasPublisherInfo: Boolean(parsed.publisher),
    hasCityInfo: Boolean(parsed.city),
    hasIsbnInfo: Boolean(parsed.isbn),
    rawData: parsed,
  };
}

export function getReportInfo(metadata: unknown) {
  const parsed = parseReportMetadata(metadata);
  if (!parsed) return null;

  return {
    organization: parsed.organization || "",
    reportNumber: parsed.reportNumber || "",
    hasOrganizationInfo: Boolean(parsed.organization),
    hasReportNumberInfo: Boolean(parsed.reportNumber),
    rawData: parsed,
  };
}

// Validation helper for form inputs or API endpoints
export function validateAndTransformMetadata(
  metadata: unknown,
  expectedType?: PublicationType
): {
  isValid: boolean;
  data: PublicationMetadata | null;
  type: string;
  errors?: string[];
} {
  const parsed = parseMetadata(metadata);

  if (!parsed.data) {
    return {
      isValid: false,
      data: null,
      type: "invalid",
      errors: parsed.errors?.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      ) || ["Invalid metadata format"],
    };
  }

  // Check if it matches expected type
  if (expectedType && parsed.type !== expectedType) {
    return {
      isValid: false,
      data: null,
      type: parsed.type,
      errors: [`Expected ${expectedType} metadata, got ${parsed.type}`],
    };
  }

  return {
    isValid: true,
    data: parsed.data,
    type: parsed.type,
  };
}
