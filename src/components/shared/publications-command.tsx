"use client";

import { BookOpen, ExternalLink, Quote, SearchIcon, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Kbd } from "@/components/shared/kbd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatInTextCitation } from "@/db/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { PublicationSearchResults } from "@/lib/actions/queries";
import { searchPublications } from "@/lib/actions/search";
import { cn, formatPublicationDate, isMacOs } from "@/lib/utils";

type Props = React.ComponentProps<typeof Button>;

function PublicationsCommand({ className, ...props }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [data, setData] = React.useState<PublicationSearchResults>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      setData([]);
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const result = await searchPublications(debouncedQuery);
        if (result.success) {
          setData(result.results);
          console.log("Pub results: ", result.results);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [debouncedQuery]);

  const getPublicationTypeColor = (type: string) => {
    const colors = {
      journal_article: "bg-blue-100 text-blue-800",
      conference_paper: "bg-green-100 text-green-800",
      book_chapter: "bg-purple-100 text-purple-800",
      thesis: "bg-orange-100 text-orange-800",
      preprint: "bg-yellow-100 text-yellow-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatPublicationType = (type: string) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onSelect = React.useCallback((callback: () => unknown) => {
    setOpen(false);
    callback();
  }, []);
  return (
    <React.Fragment>
      <Button
        variant="outline"
        size={"sm"}
        className={cn(
          "relative has-[>svg]:px-1 justify-start gap-1",
          className
        )}
        // className="relative px-2.5 md:w-full lg:w-60 lg:justify-start lg:px-3"
        onClick={() => setOpen(true)}
        {...props}
      >
        <SearchIcon
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
          strokeWidth={1.5}
        />
        <span className="hidden xs:inline text-muted-foreground text-xs md:hidden lg:inline">
          Search publications
        </span>
        <span className="sr-only">Search publications</span>
        <Kbd
          title={isMacOs() ? "Command" : "Control"}
          className="pointer-events-none absolute right-1 top-0 bottom-0 my-1 inline-flex items-center text-muted-foreground md:hidden lg:inline-flex"
        >
          {isMacOs() ? "⌘" : "Ctrl"} P
        </Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setQuery("");
            setData([]);
          }
        }}
        command={{ shouldFilter: false }}
        showCloseButton={false}
        width={"800px"}
      >
        <CommandInput
          placeholder="Search by title, abstract, DOI, journal or conference..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <div className="space-y-3 overflow-hidden px-4 py-3">
              <div className="flex items-center gap-2">
                <SearchIcon className="size-4 opacity-50" />
                <span className="text-sm text-muted-foreground">
                  Searching publications...
                </span>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-16 w-full rounded-sm" />
                <Skeleton className="h-16 w-full rounded-sm" />
                <Skeleton className="h-16 w-full rounded-sm" />
              </div>
            </div>
          )}
          {!loading && query && data.length === 0 && (
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-6">
                <SearchIcon className="size-8 opacity-20" />
                <p className="text-sm text-muted-foreground">
                  No publications found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground">
                  Try searching by title, abstract, DOI, journal or conference
                  name
                </p>
              </div>
            </CommandEmpty>
          )}
          {!loading && data.length > 0 && (
            <CommandGroup
              heading={`${data.length} publication${
                data.length === 1 ? "" : "s"
              } found`}
              className="p-2"
            >
              {/* <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3"> */}
              {data.map((publication) => (
                <CommandItem
                  key={publication.id}
                  value={publication.id}
                  onSelect={() =>
                    onSelect(() =>
                      router.push(`/publications/${publication.id}`)
                    )
                  }
                  className="flex flex-col items-start gap-2 p-4 cursor-pointer data-[selected]:bg-accent/50"
                >
                  <div className="flex items-start justify-between w-full gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Header with type and date */}
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs font-medium",
                            getPublicationTypeColor(publication.type)
                          )}
                        >
                          {formatPublicationType(publication.type)}
                        </Badge>
                        {publication.publicationDate && (
                          <span className="text-xs text-muted-foreground">
                            {formatPublicationDate(publication.publicationDate)}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-medium text-sm leading-snug line-clamp-2">
                        {publication.title}
                      </h3>

                      {/* Metadata row */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <Users className="size-3" />
                          <span className="truncate">
                            {formatInTextCitation(publication.authors)}
                          </span>
                        </div>

                        {publication.venue && (
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <BookOpen className="size-3" />
                            <span className="truncate">
                              {publication.venue}
                            </span>
                          </div>
                        )}

                        {publication.citationCount !== null &&
                          publication.citationCount > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Quote className="size-3" />
                              <span>{publication.citationCount} citations</span>
                            </div>
                          )}
                      </div>

                      {/* Abstract preview */}
                      {publication.abstract && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {publication.abstract}
                        </p>
                      )}
                    </div>

                    {/* External link button */}
                    {publication.link && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 shrink-0 opacity-60 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(publication.link!, "_blank");
                            }}
                          >
                            <ExternalLink className="size-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Open publication</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </CommandItem>
              ))}
              {/* </div> */}
            </CommandGroup>
          )}
          {!query && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <SearchIcon className="size-8 opacity-20" />
              <p className="text-muted-foreground">
                Start typing to search publications
              </p>
              <p className="text-xs text-muted-foreground">
                Search by title, abstract, DOI, journal or conference name
              </p>
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </React.Fragment>
  );
}

export { PublicationsCommand };
