import type { Metadata } from "next";
import * as React from "react";

import { Pagination } from "@/components/shared/pagination";
import { Page } from "@/components/shell";
import { Card } from "@/components/views/publications/card";
import { filterAndSortPublications } from "@/lib/publications";
import { getCachedPaginatedPublications } from "@/lib/queries/publications";
import { cn } from "@/lib/utils";
import { SortOption, ViewMode } from "@/types";

export const metadata: Metadata = {
  title: "Publications",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Publications({
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

  // console.log({ sortBy, viewMode, publications });

  const { publications, pagination } = await getCachedPaginatedPublications(
    validPage
  );

  const filteredPublications = filterAndSortPublications(publications, sortBy);

  return (
    <Page
      variant={"publications"}
      className={cn(viewMode === "detailed" ? "grid-cols-1" : "md:grid-cols-2")}
    >
      {/* <React.Suspense fallback={<PublicationsSkeleton />}> */}
      {filteredPublications.map((publication) => (
        <Card
          key={publication.id}
          publication={publication}
          viewMode={viewMode}
        />
      ))}
      <Pagination
        className={cn(viewMode === "compact" && "md:col-span-2")}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        baseUrl="/publications"
        searchParams={{ sort: sortBy, view: viewMode }}
      />
      {filteredPublications.length === 0 && (
        <React.Fragment>
          <h1 className="text-lg">Publications</h1>
          <small>There are no publications yet</small>
        </React.Fragment>
      )}
      {/* </React.Suspense> */}
    </Page>
  );
}
