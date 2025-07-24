import { formatDistanceToNowStrict } from "date-fns";
import { Calendar, Clock, ExternalLink, Eye, Tag, Users } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import * as React from "react";

import { Page } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/views/publications/videos/modal";
import { Thumbnail } from "@/components/views/publications/videos/thumbnail";
import { videoCats } from "@/config/enums";
import { getVideoByYoutubeId } from "@/lib/queries/videos";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ youtubeId: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { youtubeId } = await params;
  const video = await getVideoByYoutubeId(youtubeId);

  return {
    title: video.title || (await parent).title,
    description: video.description || (await parent).description,
    openGraph: {
      title: video.title,
      description: video.description || undefined,
      images: video.metadata?.thumbnailUrl
        ? [video.metadata.thumbnailUrl]
        : undefined,
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description || undefined,
      images: video.metadata?.thumbnailUrl
        ? [video.metadata.thumbnailUrl]
        : undefined,
    },
  };
}

const formatViewCount = (count?: number) => {
  if (!count) return "0 views";
  if (count < 1000) return `${count} views`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K views`;
  return `${(count / 1000000).toFixed(1)}M views`;
};

const formatDuration = (duration?: string) => {
  if (!duration) return null;
  // Parse ISO 8601 duration (PT1H2M3S format)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;

  const [, hours, minutes, seconds] = match;
  const parts = [];

  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds && !hours) parts.push(`${seconds}s`);

  return parts.join(" ") || "0s";
};

export default async function VideoDetailsPage({ params }: Props) {
  const { youtubeId } = await params;

  const video = await getVideoByYoutubeId(youtubeId);

  const viewCount = Math.max(
    video.viewCount || 0,
    video.metadata?.viewCount || 0
  );

  const videoData = [{ youtubeId: video.youtubeId, title: video.title }];

  return (
    <React.Fragment>
      <Page variant={"publications"} className="lg:grid-cols-3">
        {/* Main content - Left side (2 columns) */}
        <div className="space-y-4 lg:col-span-2">
          {/* Video player area */}
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Thumbnail
              videoId={video.youtubeId}
              title={video.title}
              thumbnailUrl={video.metadata?.thumbnailUrl}
              className="w-full h-full"
            />
          </div>

          {/* Basic info */}
          <div className="flex flex-wrap items-start gap-2">
            {video.isFeatured && <Badge variant="brand">Featured</Badge>}
            {video.category && (
              <Badge variant="outline">
                <Tag className="size-3" />
                {videoCats.getLabel(video.category)}
              </Badge>
            )}
            {video.series && (
              <Badge variant="secondary">Series: {video.series}</Badge>
            )}
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "ml-auto",
                buttonVariants({
                  size: "sm",
                  className: "h-auto text-xs has-[>svg]:px-2 gap-1 py-0.5",
                })
              )}
            >
              <ExternalLink className="size-3" />
              Watch on YouTube
            </a>
          </div>

          <div className="space-y-2">
            <h1 className="font-semibold text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl">
              {video.title}
            </h1>

            {/* Stats and actions */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="size-4" />
                {formatViewCount(viewCount)}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                {formatDistanceToNowStrict(new Date(video.publishedAt), {
                  addSuffix: true,
                })}
              </div>
              {video.metadata?.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="size-4" />
                  {formatDuration(video.metadata.duration)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Right side (1 column) */}
        <div className="lg:col-span-1 space-y-4">
          {/* Description */}
          {video.description && (
            <div className="bg-card rounded-xl border p-4 sm:p-6 shadow-sm space-y-2.5">
              <h2 className="text-base font-semibold">Description:</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap lg:line-clamp-[20]">
                {video.description}
              </p>
            </div>
          )}

          {/* Authors */}
          <div
            className={cn(
              "flex gap-1.5",
              video.authors.length === 1 ? "items-center" : "items-start"
            )}
          >
            <Users
              className={cn(
                "size-4 text-muted-foreground flex-shrink-0",
                video.authors.length > 1 && "mt-0.5"
              )}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div>
              <span className="sr-only">Contributors: </span>
              {video.authors.map((author, index) => (
                <span key={`${author.author.name}-${index}`}>
                  <span className="font-medium text-muted-foreground">
                    {author.author.name}
                  </span>
                  {author.role && (
                    <span className="text-muted-foreground/70 text-xs ml-1">
                      ({author.role})
                    </span>
                  )}
                  {index < video.authors.length - 1 && (
                    <span className="text-muted-foreground">, </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Page>

      {/* Video modal for inline playback */}
      <Modal videos={videoData} />
    </React.Fragment>
  );
}
