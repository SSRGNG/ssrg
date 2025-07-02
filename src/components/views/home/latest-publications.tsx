import { ExternalLink, Link2, Users } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Section } from "@/components/shell/section";
import { Badge } from "@/components/ui/badge";
import { TYPE_CONFIG } from "@/config/constants";
import { publications } from "@/config/enums";
import { formatInTextCitation } from "@/db/utils";
import { LatestPublications as LatestPubsType } from "@/lib/actions/queries";
import { getCachedLatestPublications } from "@/lib/queries/publications";
import { cn, formatPublicationDate } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;
type LatestArticle = LatestPubsType[number];

async function LatestPublications({ className, ...props }: Props) {
  const latest = await getCachedLatestPublications(2);

  if (!latest.length) return null;
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{ title: "Latest Publications" }}
      {...props}
    >
      <div className="grid md:grid-cols-2 gap-4">
        {latest.map((article, index) => (
          <LatestArticleCard key={index} article={article} />
        ))}
      </div>
    </Section>
  );
}

const AuthorList = React.memo(
  ({ authors }: { authors: LatestArticle["authors"] }) => (
    <div className="flex items-center gap-1.5">
      <Users
        className="size-3 text-muted-foreground flex-shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span className="text-muted-foreground truncate">
        {formatInTextCitation(authors)}
      </span>
    </div>
  )
);
AuthorList.displayName = "AuthorList";

const ExternalLinks = React.memo(
  ({ publication }: { publication: LatestArticle }) => {
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

    return <div className={cn("flex items-center gap-4")}>{links}</div>;
  }
);
ExternalLinks.displayName = "ExternalLinks";

function LatestArticleCard({ article }: { article: LatestArticle }) {
  const config = TYPE_CONFIG[article.type] || TYPE_CONFIG.journal_article;
  const Icon = config.icon;
  const label = publications.getLabel(article.type);

  return (
    <article
      className={cn(
        "bg-card text-card-foreground rounded-xl border p-4 sm:p-6 shadow-sm",
        "hover:border-border/80 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 grid gap-2.5"
      )}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Badge
            className={cn(
              config.color,
              config.bgColor,
              "uppercase tracking-wide"
            )}
          >
            <Icon className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            {label}
          </Badge>
          <span className="text-muted-foreground/50" aria-hidden="true">
            •
          </span>
          <time
            className="text-sm text-muted-foreground whitespace-nowrap"
            dateTime={article.publicationDate ?? undefined}
          >
            {formatPublicationDate(article.publicationDate)}
          </time>
        </div>
      </header>
      <div className="space-y-2.5">
        <h3 className={cn("text-base md:text-lg font-medium line-clamp-2")}>
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.abstract}
        </p>
      </div>
      <footer className="flex items-center justify-between gap-4 text-xs font-medium">
        <AuthorList authors={article.authors} />
        <ExternalLinks publication={article} />
      </footer>
    </article>
  );
}

export { LatestPublications };
