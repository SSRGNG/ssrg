import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { DOI_REGEX, ORCID_REGEX, researchers } from "@/config/constants";
import {
  extractMetadataFields,
  getConferenceInfo,
  getJournalInfo,
  getMetadataField,
} from "@/db/utils";
import {
  AdminAreasData,
  ResearchersWithRelations,
  ResearcherWithPublications,
} from "@/lib/actions/queries";
import type { NavItem, Role, UserNavItem } from "@/types";

export { doiValidator, orcidValidator } from "@/lib/validations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const unknownError =
  "An unknown error occurred. Please try again later.";

export function getErrorMessage(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function catchError(err: unknown) {
  const errorMessage = getErrorMessage(err);
  return toast.error(errorMessage);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function formatPrice(
  price: number | string,
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: options.currency ?? "NGN",
    notation: options.notation ?? "standard",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    ...options,
  }).format(Number(price));
}

export function formatNumber(
  number: number | string,
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat("en-US", {
    style: options.style ?? "decimal",
    notation: options.notation ?? "standard",
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    ...options,
  }).format(Number(number));
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: options.month ?? "long",
    day: options.day ?? "numeric",
    year: options.year ?? "numeric",
    ...options,
  }).format(new Date(date));
}
// export const handleQuickDateSelect = (
//   value: string,
//   onChange: (date: Date) => void
// ) => {
//   const days = Math.abs(parseInt(value));
//   const newDate = subDays(new Date(), days);
//   onChange(newDate);
// };

// Helper function to check if the user's role is allowed
export const isRoleAllowed = (allowedRoles: Role | Role[], userRole: Role) => {
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole);
  }
  return allowedRoles === userRole;
};

export const getInitials = (name?: string | null): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const passwordBuffer = encoder.encode(password);
  const saltedPassword = new Uint8Array([...passwordBuffer, ...salt]);

  const hashBuffer = await crypto.subtle.digest("SHA-256", saltedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const [saltHex, storedHashHex] = hash.split(":");

  // Convert salt from hex to Uint8Array
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltedPassword = new Uint8Array([...passwordBuffer, ...salt]);

  const hashBuffer = await crypto.subtle.digest("SHA-256", saltedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex === storedHashHex;
}

export const mapUserNav = (
  items: Record<string, Omit<UserNavItem, "cmd">>
): UserNavItem[] => {
  // const navArray: UserNavItem[] = Object.values(items);
  return Object.entries(items).map(([key, item]) => ({
    ...item,
    cmd: `⌘${key.toUpperCase()}`,
  }));
};

export const mapNavItems = (items: NavItem[]) => {
  return items.map((item) => ({
    title: item.title,
    href: item.href,
    description: item.description,
    icon: item.icon,
    items: [],
  }));
};

export function mapResearchers(researchers: ResearchersWithRelations) {
  return researchers.map((researcher) => {
    const publications = researcher.author.publications.map(
      ({ publication }) => {
        const year = publication.publicationDate
          ? new Date(publication.publicationDate).getFullYear()
          : null;
        return year ? `${publication.title} (${year})` : publication.title;
      }
    );

    return {
      id: researcher.id,
      name: researcher.user.name,
      title: researcher.title,
      image: researcher.user.image || "/images/placeholder.webp",
      areas: researcher.areas.map((area) => area.area.title),
      bio: researcher.bio,
      expertise: researcher.expertise.map((e) => e.expertise),
      education: researcher.education.map((e) => e.education),
      publications: [...new Set(publications)], // Remove duplicates
      projects: researcher.leadProjects.map((p) => p.title),
      contact: {
        email: researcher.user.email,
        orcid: researcher.orcid || undefined,
        twitter: researcher.x ? `@${researcher.x.replace("@", "")}` : undefined,
      },
      featured: researcher.featured,
    };
  });
}

export function mapResearchAreas(areas: AdminAreasData) {
  return areas.map((area) => {
    // Format publications with authors and metadata
    const publications = area.publications.map(({ publication }) => {
      // Format author names (Last, F. & Last, F.)
      const authorNames = publication.authors.map(({ author }) => {
        const nameParts = author.name.split(" ");
        const lastName = nameParts[nameParts.length - 1];
        const firstInitial = nameParts[0][0];
        return `${lastName}, ${firstInitial}.`;
      });

      // Join authors with & for last author
      const authorsText =
        authorNames.length <= 2
          ? authorNames.join(" & ")
          : `${authorNames.slice(0, -1).join(", ")} & ${
              authorNames[authorNames.length - 1]
            }`;

      // Get year from publication date
      const year = publication.publicationDate
        ? new Date(publication.publicationDate).getFullYear()
        : null;

      // Safely extract and validate metadata fields
      const metadataFields = extractMetadataFields(publication.metadata);

      // Get type-specific info
      const journalInfo = getJournalInfo(publication.metadata);
      const conferenceInfo = getConferenceInfo(publication.metadata);

      // Safe field extraction with Zod validation
      const journal =
        journalInfo?.journal ||
        conferenceInfo?.conferenceName ||
        getMetadataField(publication.metadata, "journal_article", "");
      const volume = journalInfo?.volume || "";
      const pages = journalInfo?.pages || "";

      return {
        id: publication.id,
        title: publication.title,
        authors: authorsText,
        venue: publication.venue,
        metadata: publication.metadata,
        journal,
        volume,
        pages,
        metadataType: metadataFields.type,
        year,
        type: publication.type,
        doi: publication.doi || undefined,
        link: `/publications/academic/${publication.id}`,
      };
    });

    return {
      id: area.id,
      title: area.title,
      icon: area.icon,
      image: area.image,
      description: area.description,
      detail: area.detail,
      questions: area.questions.map((q) => q.question),
      methods: area.methods.map((method) => ({
        title: method.title,
        description: method.description,
      })),
      findings: area.findings.map((f) => f.finding),
      publications,
      href: area.href,
      linkText: area.linkText || `Explore ${area.title} Research`,
    };
  });
}

export function mapResearcherPublications(
  researcher: ResearcherWithPublications
) {
  return (
    researcher
      .map((userPublication) => {
        const pub = userPublication.publication;

        const authors = pub.authors.map((author) => ({
          order: author.order,
          isCorresponding: author.isCorresponding,
          name: author.author.name,
          email: author.author.email,
          affiliation: author.author.affiliation,
          orcid: author.author.orcid,
          researcher: author.author.researcher
            ? {
                id: author.author.researcher.id,
                title: author.author.researcher.title,
              }
            : null,
        }));

        return {
          // Publication fields
          id: pub.id,
          title: pub.title,
          type: pub.type,
          doi: pub.doi,
          publicationDate: pub.publicationDate,
          abstract: pub.abstract,
          link: pub.link,
          venue: pub.venue,
          metadata: pub.metadata,
          citationCount: pub.citationCount,
          lastCitationUpdate: pub.lastCitationUpdate,
          creatorId: pub.creatorId,

          // User-specific fields
          userAuthorOrder: userPublication.order,
          userIsCorresponding: userPublication.isCorresponding,
          isLeadAuthor: userPublication.order === 0,

          // Authors list
          authors,

          // Permission flags
          canDelete:
            userPublication.order === Math.min(...authors.map((a) => a.order)),
        };
      })
      // Sort by publication date (most recent first)
      .sort((a, b) => {
        if (!a.publicationDate || !b.publicationDate) return 0;
        return (
          new Date(b.publicationDate).getTime() -
          new Date(a.publicationDate).getTime()
        );
      })
  );
}

export const getResearchersByArea = (areaTitle: string) => {
  return researchers.filter((researcher) =>
    researcher.areas.includes(areaTitle)
  );
};

export const featuredResearchers = researchers.filter(
  (researcher) => researcher.featured === true
);

export function createEnum<const T extends [string, ...string[]]>(
  ...values: T
) {
  return {
    values,
    schema: z.enum(values),
    type: null as unknown as T[number],
  };
}

// Utility to convert snake_case or kebab-case to Title Case
export function humanize(value: string): string {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function defineEnum<const T extends readonly [string, ...string[]]>(
  ...values: T
) {
  const items = values.map((value) => ({
    value,
    label: humanize(value),
  }));

  const labelMap = Object.fromEntries(
    values.map((value) => [value, humanize(value)])
  ) as Record<T[number], string>;

  return {
    values,
    schema: z.enum(values),
    type: null as unknown as T[number],
    items,
    labels: labelMap,
    getLabel: (value: T[number]) => labelMap[value],
  } as const;
}

export function isValidDOI(doi: string) {
  return DOI_REGEX.test(doi);
}

export function isValidORCID(orcid: string): boolean {
  return ORCID_REGEX.test(orcid);
}

export function normalizeDOI(input: string) {
  if (!input) return null;

  // Remove common prefixes
  const cleaned = input
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, "")
    .replace(/^doi:/, "")
    .trim();

  return isValidDOI(cleaned) ? cleaned : null;
}

export function normalizeORCID(input: string) {
  if (!input) return null;

  const cleaned = input
    .replace(/^https?:\/\/orcid\.org\//, "")
    .replace(/[^0-9X-]/g, "")
    .toUpperCase();

  return isValidORCID(cleaned) ? cleaned : null;
}
