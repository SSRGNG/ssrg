"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div"> & {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
};

function Thumbnail({
  videoId,
  title,
  thumbnailUrl,
  className,
  ...props
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = React.useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("play", videoId);

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [videoId, router, searchParams, pathname]);

  return (
    <div
      className={cn("relative group cursor-pointer h-full", className)}
      onClick={handleClick}
      {...props}
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          height={800}
          width={450}
          className="h-full w-full object-cover aspect-[24/9]"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted aspect-[24/9]">
          <Play className="size-8 text-muted-foreground" />
        </div>
      )}

      {/* Play overlay */}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform">
          <Play className="size-8 text-red-600 fill-current" />
        </div>
      </div>
    </div>
  );
}

export { Thumbnail };
