"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateVideoViewCount } from "@/lib/actions/videos";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

type Props = React.ComponentProps<typeof Dialog> & {
  videos: Array<{ youtubeId: string; title: string }>; // Pass minimal video data
};

function Modal({ videos, ...props }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const playingVideoId = searchParams.get("play");

  const currentVideo = videos.find((v) => v.youtubeId === playingVideoId);
  const isOpen = !!currentVideo;

  const [hasTrackedView, setHasTrackedView] = React.useState(false);

  // Handle view count tracking
  React.useEffect(() => {
    if (currentVideo && !hasTrackedView) {
      setHasTrackedView(true);
      updateVideoViewCount(currentVideo.youtubeId).catch(console.error);
    }
  }, [currentVideo, hasTrackedView]);

  // Reset tracking when video changes
  React.useEffect(() => {
    setHasTrackedView(false);
  }, [playingVideoId]);

  const handleClose = React.useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("play");
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : `${pathname}`;
    router.push(newUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  if (!currentVideo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} {...props}>
      <DialogContent className="max-w-4xl w-[90vw] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{currentVideo.title}</DialogTitle>
          <DialogDescription>
            Video player for {currentVideo.title}
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full aspect-video">
          <Tooltip>
            <TooltipTrigger asChild>
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0`}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </TooltipTrigger>
            <TooltipContent>{currentVideo.title}</TooltipContent>
          </Tooltip>
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 z-10"
            onClick={handleClose}
          >
            <X className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { Modal };
