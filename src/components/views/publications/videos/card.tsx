import { formatDistanceToNowStrict } from "date-fns";
import { ExternalLink, Link2, Play, Tag, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card as LinkCard,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { videoCats } from "@/config/enums";
import { formatInText } from "@/db/utils";
import { Videos } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
import { ViewMode } from "@/types";

type VideoType = Videos[number];
type Props = React.ComponentPropsWithoutRef<typeof LinkCard> & {
  video: VideoType;
  idx: number;
  viewMode: ViewMode;
};

const formatViewCount = (count?: number) => {
  if (!count) return "0 views";
  if (count < 1000) return `${count} views`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K views`;
  return `${(count / 1000000).toFixed(1)}M views`;
};

const formatInTextCitation = (authors: VideoType["authors"]) => {
  return formatInText(authors, (author) => author.name);
  // if (authors.length === 0) return "";
  // if (authors.length === 1) return authors[0].name;
  // if (authors.length === 2) return `${authors[0].name} & ${authors[1].name}`;
  // return `${authors[0].name} et al.`;
};

const AuthorList = React.memo(
  ({
    authors,
    compact = false,
  }: {
    authors: VideoType["authors"];
    compact?: boolean;
  }) => (
    <div className="flex items-start gap-1.5 text-sm">
      <Users
        className="size-4 mt-0.5 text-muted-foreground flex-shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div className={compact ? "truncate" : ""}>
        <span className="sr-only">Contributors: </span>
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
              {author.role && (
                <span className="text-muted-foreground/70 text-xs ml-1">
                  ({author.role})
                </span>
              )}
              {author.affiliation && (
                <span className="text-muted-foreground/70 text-xs ml-1">
                  - {author.affiliation}
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
  ({ video, compact = false }: { video: VideoType; compact?: boolean }) => {
    const links = [];

    // Always show YouTube link
    links.push(
      <a
        key="youtube"
        href={video.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-brand hover:text-brand/80 transition-colors"
        aria-label="Watch on YouTube"
      >
        {compact ? "YouTube" : "Watch on YouTube"}
        <ExternalLink className="size-3" strokeWidth={1.5} aria-hidden="true" />
      </a>
    );

    links.push(
      <Link
        key={video.id}
        href={`/publications/videos/${video.youtubeId}`}
        className="inline-flex items-center gap-1 text-brand hover:text-brand/80 transition-colors"
        aria-label="View abstract"
      >
        View Details{" "}
        <Link2 className="size-3" strokeWidth={1.5} aria-hidden="true" />
      </Link>
    );
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 text-xs font-medium",
          compact ? "flex-wrap" : ""
        )}
      >
        {links}
      </div>
    );
  }
);
ExternalLinks.displayName = "ExternalLinks";

function Card({ video, idx, viewMode, className, ...props }: Props) {
  const isCompact = viewMode === "compact";
  const viewCount = video.metadata?.viewCount ?? 0;

  return (
    // <Link className={cn("grid group", className)} href={href} {...props}>
    <LinkCard
      className={cn(
        "gap-0 py-0 sm:py-0 overflow-hidden",
        idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
        className
      )}
      {...props}
    >
      <CardHeader className="px-0 sm:px-0 md:w-2/3 grid-rows-[auto] relative">
        {video.metadata?.thumbnailUrl ? (
          <Image
            src={video.metadata.thumbnailUrl}
            alt={video.title}
            height={800}
            width={450}
            className={cn("h-full w-full object-cover aspect-[24/9]")}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted aspect-[24/9">
            <Play className="size-8 text-muted-foreground" />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-muted backdrop-blur-sm rounded-full p-2">
            <Play className="size-6 text-red-600 fill-current" />
          </div>
        </div>
        <div className="absolute top-2 left-2 inline-flex items-center gap-1">
          {video.isFeatured && (
            <React.Fragment>
              <Badge variant={"brand"}>Featured</Badge>
              <Separator
                orientation="vertical"
                className="bg-brand data-[orientation=vertical]:h-4"
              />
            </React.Fragment>
          )}
          {video.category && (
            <Badge variant={"brand"}>
              <Tag className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
              {videoCats.getLabel(video.category)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 py-4 sm:py-6 md:w-2/3 leading-none">
        <CardTitle className="text-base md:text-lg font-medium line-clamp-2">
          {video.title}
        </CardTitle>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{formatViewCount(viewCount)}</span>
          <span>•</span>
          <span>
            {formatDistanceToNowStrict(new Date(video.publishedAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        {video.description && !isCompact && (
          <CardDescription className="line-clamp-3 text-muted-foreground/70">
            {video.description}
          </CardDescription>
        )}
        <AuthorList authors={video.authors} compact={isCompact} />
        <ExternalLinks video={video} compact={isCompact} />
      </CardContent>
    </LinkCard>
    // </Link>
  );
}

export { Card };
