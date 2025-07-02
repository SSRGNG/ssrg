import { ExternalLink, Link2, Trophy, Users } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { TYPE_CONFIG } from "@/config/constants";
import { publications } from "@/config/enums";
import { formatInTextCitation } from "@/db/utils";
import { Publications } from "@/lib/actions/queries";
import { cn, formatPublicationDate } from "@/lib/utils";
import { ViewMode } from "@/types";

type Props = React.ComponentProps<"article"> & {
  publication: Publications[number];
  viewMode: ViewMode;
};

type PublicationType = Publications[number]["type"];

const TypeBadge = React.memo(({ type }: { type: PublicationType }) => {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.journal_article;
  const Icon = config.icon;

  return (
    <Badge
      className={cn(config.color, config.bgColor, "uppercase tracking-wide")}
    >
      <Icon className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
      {publications.getLabel(type)}
    </Badge>
  );
});
TypeBadge.displayName = "TypeBadge";

const CitationCount = React.memo(({ count }: { count: number }) => (
  <div
    className="flex items-center gap-1 text-sm text-muted-foreground"
    title={`Cited ${count} times`}
  >
    <Trophy className="size-4" strokeWidth={1.5} aria-hidden="true" />
    <span className="sr-only">Citations: </span>
    {count}
  </div>
));
CitationCount.displayName = "CitationCount";

const AuthorList = React.memo(
  ({
    authors,
    compact = false,
  }: {
    authors: Publications[number]["authors"];
    compact?: boolean;
  }) => (
    <div className="flex items-start gap-1.5 text-sm">
      <Users
        className="size-4 mt-0.5 text-muted-foreground flex-shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div className={compact ? "truncate" : ""}>
        <span className="sr-only">Authors: </span>
        {compact ? (
          <span className="text-muted-foreground">
            {formatInTextCitation(authors)}
          </span>
        ) : (
          authors.map((author, index) => (
            <span key={`${author.name}-${index}`}>
              <span className="font-medium text-muted-foreground">
                {author.name}
              </span>
              {author.affiliation && (
                <span className="text-muted-foreground/70 text-xs ml-1">
                  ({author.affiliation})
                </span>
              )}
              {index < authors.length - 1 && (
                <span className="text-muted-foreground">, </span>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  )
);
AuthorList.displayName = "AuthorList";

const ExternalLinks = React.memo(
  ({
    publication,
    compact = false,
  }: {
    publication: Publications[number];
    compact?: boolean;
  }) => {
    const links = [];

    if (publication.doi) {
      links.push(
        <a
          key="doi"
          href={`https://doi.org/${publication.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-brand hover:text-brand/80 transition-colors"
          aria-label={`DOI: ${publication.doi}`}
        >
          DOI{" "}
          <ExternalLink
            className="size-3"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </a>
      );
    }

    if (publication.link) {
      links.push(
        <a
          key="link"
          href={publication.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-brand hover:text-brand/80 transition-colors"
          aria-label="View publication"
        >
          View Link{" "}
          <ExternalLink
            className="size-3"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </a>
      );
    }

    if (publication.abstract) {
      links.push(
        <Link
          key="abstract"
          href={`/publications/${publication.id}`}
          className="inline-flex items-center gap-1 text-brand hover:text-brand/80 transition-colors"
          aria-label="View abstract"
        >
          View Abstract{" "}
          <Link2 className="size-3" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      );
    }

    return (
      <div
        className={cn(
          "flex items-center gap-4 text-xs font-medium",
          compact ? "flex-wrap" : ""
        )}
      >
        {links}
      </div>
    );
  }
);
ExternalLinks.displayName = "ExternalLinks";

function Card({ publication, viewMode, className, ...props }: Props) {
  const isCompact = viewMode === "compact";
  const citationCount = publication.citationCount ?? 0;

  return (
    <article
      className={cn(
        // "group border border-border rounded-lg p-4 transition-all duration-200",
        "bg-card text-card-foreground rounded-xl border p-4 sm:p-6 shadow-sm",
        "hover:border-border/80 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 space-y-2.5",
        // isCompact ? "space-y-3" : "space-y-3",
        className
      )}
      {...props}
    >
      {/* Header with type and date */}
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <TypeBadge type={publication.type} />
          <span className="text-muted-foreground/50" aria-hidden="true">
            •
          </span>
          <time
            className="text-sm text-muted-foreground whitespace-nowrap"
            dateTime={publication.publicationDate ?? undefined}
          >
            {formatPublicationDate(publication.publicationDate)}
          </time>
        </div>
        {!isCompact && <CitationCount count={citationCount} />}
      </header>

      {/* Main content */}
      <div className="space-y-2.5">
        <h3 className={cn("text-base md:text-lg font-medium line-clamp-2")}>
          {publication.title}
        </h3>

        {publication.venue && (
          <p
            className={cn(
              "text-sm text-muted-foreground/70 font-medium",
              isCompact ? "truncate" : "line-clamp-1"
            )}
          >
            {publication.venue}
          </p>
        )}

        {!isCompact && publication.abstract && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {publication.abstract}
          </p>
        )}
      </div>

      {/* Authors */}
      <AuthorList authors={publication.authors} compact={isCompact} />

      {/* Footer with links and citation count */}
      <footer className="flex items-center justify-between gap-4 pt-1">
        <ExternalLinks publication={publication} compact={isCompact} />
        {isCompact && <CitationCount count={citationCount} />}
      </footer>
    </article>
  );
}

export { Card };
