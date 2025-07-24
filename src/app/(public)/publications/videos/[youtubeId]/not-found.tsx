import { ArrowLeft, Video } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="size-24 mx-auto bg-muted rounded-full flex items-center justify-center">
          <Video className="size-12 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Video Not Found</h1>
          <p className="text-muted-foreground">
            The video you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
        </div>

        <Link href="/publications/videos" className={cn(buttonVariants())}>
          <ArrowLeft className="size-4" />
          Back to Videos
        </Link>
      </div>
    </div>
  );
}
