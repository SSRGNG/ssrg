import { ExternalLink, Users } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

import { Page } from "@/components/shell";
import { getPublication } from "@/lib/queries/publications";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const publication = await getPublication(slug);

  return {
    title: publication.title || (await parent).title,
    description: publication.abstract || (await parent).description,
  };
}

export default async function PublicationDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const publication = await getPublication(slug);

  return (
    <Page variant={"publications"}>
      <article className="space-y-3">
        <header>
          <h1 className="font-semibold text-base md:text-lg">
            {publication.title}
          </h1>
        </header>
        {publication.venue && (
          <p className="text-sm text-muted-foreground/70 font-medium">
            {publication.venue}
          </p>
        )}
        {publication.abstract && (
          <div className="bg-card rounded-xl border p-4 sm:p-6 shadow-sm space-y-2.5">
            <h2 className="text-base font-semibold">Abstract:</h2>
            <p className="text-sm text-muted-foreground">
              {publication.abstract}
            </p>
          </div>
        )}
        <footer className="flex items-start justify-between gap-4 text-xs font-medium">
          <div
            className={cn(
              "flex gap-1.5",
              publication.authors.length === 1 ? "items-center" : "items-start"
            )}
          >
            <Users
              className={cn(
                "size-4 text-muted-foreground flex-shrink-0",
                publication.authors.length > 1 && "mt-0.5"
              )}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div>
              <span className="sr-only">Authors: </span>
              {publication.authors.map((author, index) => (
                <span key={`${author.author.name}-${index}`}>
                  <span className="font-medium text-muted-foreground">
                    {author.author.name}
                  </span>
                  {author.author.affiliation && (
                    <span className="text-muted-foreground/70 text-xs ml-1">
                      ({author.author.affiliation})
                    </span>
                  )}
                  {index < publication.authors.length - 1 && (
                    <span className="text-muted-foreground">, </span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {publication.doi && (
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
            )}
            {publication.link && !publication.doi && (
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
            )}
          </div>
        </footer>
      </article>
    </Page>
  );
}
