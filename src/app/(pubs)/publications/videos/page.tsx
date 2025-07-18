import type { Metadata } from "next";
import * as React from "react";

import { Pagination } from "@/components/shared/pagination";
import { Page } from "@/components/shell";
import { Card } from "@/components/views/publications/videos/card";
import { getCachedPaginatedVideos } from "@/lib/queries/videos";
import { cn } from "@/lib/utils";
import { SortOption, ViewMode } from "@/types";

export const metadata: Metadata = {
  title: "Video Contents",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Videos({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const sortBy = (
    typeof params.sort === "string" ? params.sort : "recent"
  ) as SortOption;
  const viewMode = (
    typeof params.view === "string" ? params.view : "detailed"
  ) as ViewMode;

  // Ensure page is valid
  const validPage = Math.max(1, isNaN(page) ? 1 : page);

  const { videos, pagination } = await getCachedPaginatedVideos({
    page: validPage,
  });

  // console.log({ videos });
  // console.log("authors: ", videos[0].authors);

  return (
    <Page
      variant={"publications"}
      className={cn(viewMode === "detailed" ? "grid-cols-1" : "md:grid-cols-2")}
    >
      {videos.map((video, idx) => (
        <Card key={video.id} video={video} idx={idx} viewMode={viewMode} />
      ))}
      <Pagination
        className={cn(viewMode === "compact" && "md:col-span-2")}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        baseUrl="/publications"
        searchParams={{ sort: sortBy, view: viewMode }}
      />
      {videos.length === 0 && (
        <React.Fragment>
          <h1 className="text-lg">Videos</h1>
          <small>There are no video contents yet</small>
        </React.Fragment>
      )}
    </Page>
  );
}
