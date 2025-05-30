import { SQL, sql, SQLWrapper } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

import { PortalResearcherPubs } from "@/lib/actions/queries";
import { Publication } from "@/types";

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

  // Extract last name and first initial
  const authorNames = authors.map((author) => {
    const fullName = author.researcher.user.name;
    const nameParts = fullName.trim().split(" ");
    const lastName = nameParts[nameParts.length - 1];
    const firstInitial = nameParts[0][0];
    return `${lastName}, ${firstInitial}.`;
  });

  if (authorNames.length === 1) {
    return authorNames[0];
  } else if (authorNames.length === 2) {
    return `${authorNames[0]} & ${authorNames[1]}`;
  } else {
    // APA in-text: first author + et al.
    const [firstAuthor] = authorNames;
    return `${firstAuthor} et al.`;
  }
}
