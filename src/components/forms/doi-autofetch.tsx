"use client";

import {
  AlertCircle,
  CheckCircle,
  Download,
  Loader2,
  Search,
} from "lucide-react";
import * as React from "react";
import type { Control } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPublicationByDOI } from "@/lib/actions/citations";
import type { DOIPublicationData } from "@/lib/services/doi-fetch";
import { cn } from "@/lib/utils";
import type { CreatePublicationPayload } from "@/lib/validations/publication";

type FetchState = {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  data: DOIPublicationData | null;
  source: "crossref" | "datacite" | null;
};
type Props = React.ComponentPropsWithoutRef<"div"> & {
  onDataFetched: (data: DOIPublicationData) => void;
  control: Control<CreatePublicationPayload>;
  currentDoi?: string | null;
};

function DOIAutoFetch({
  onDataFetched,
  currentDoi,
  className,
  ...props
}: Props) {
  const [doi, setDoi] = React.useState(currentDoi || "");
  const [fetchState, setFetchState] = React.useState<FetchState>({
    isLoading: false,
    error: null,
    success: false,
    data: null,
    source: null,
  });

  const handleFetch = async () => {
    if (!doi.trim()) return;

    setFetchState({
      isLoading: true,
      error: null,
      success: false,
      data: null,
      source: null,
    });

    try {
      const result = await fetchPublicationByDOI(doi.trim());

      if (result.success && result.data) {
        setFetchState({
          isLoading: false,
          error: null,
          success: true,
          data: result.data,
          source: result.source || null,
        });

        // Auto-populate form fields
        onDataFetched(result.data);
      } else {
        setFetchState({
          isLoading: false,
          error: result.error || "Failed to fetch publication data",
          success: false,
          data: null,
          source: null,
        });
      }
    } catch (error) {
      console.error("DOI fetch error:", error);
      setFetchState({
        isLoading: false,
        error: "Network error occurred while fetching data",
        success: false,
        data: null,
        source: null,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFetch();
    }
  };

  const resetFetchState = () => {
    setFetchState({
      isLoading: false,
      error: null,
      success: false,
      data: null,
      source: null,
    });
  };
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* DOI Input Section */}
      <div className="p-4 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <Download className="size-4 text-muted-foreground" />
          <h3 className="font-medium text-lg">Auto-fill from DOI</h3>
          <Badge variant="secondary" className="text-xs">
            Optional
          </Badge>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Enter DOI (e.g., 10.1038/nature12373)"
              value={doi}
              onChange={(e) => {
                setDoi(e.target.value);
                if (fetchState.success || fetchState.error) {
                  resetFetchState();
                }
              }}
              onKeyDown={handleKeyPress}
              disabled={fetchState.isLoading}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleFetch}
            disabled={fetchState.isLoading || !doi.trim()}
            className="shrink-0"
          >
            {fetchState.isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Search className="size-4" />
                Fetch
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Enter a DOI to automatically populate publication details from
          academic databases
        </p>
      </div>

      {/* Success State */}
      {fetchState.success && fetchState.data && (
        <Alert className="border-green-200">
          <CheckCircle className="size-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-foreground">
                  Publication data fetched successfully!
                </span>
                {fetchState.source && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Source: {fetchState.source}
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-2 text-sm">
              <p className="font-medium text-foreground">
                {fetchState.data.title}
              </p>
              {fetchState.data.authors &&
                fetchState.data.authors.length > 0 && (
                  <p className="text-muted-foreground">
                    Authors:{" "}
                    {fetchState.data.authors
                      .slice(0, 3)
                      .map((a) => a.name)
                      .join(", ")}
                    {fetchState.data.authors.length > 3 &&
                      ` +${fetchState.data.authors.length - 3} more`}
                  </p>
                )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Error State */}
      {fetchState.error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            <span className="font-medium">
              Failed to fetch publication data
            </span>
            <p className="mt-1">{fetchState.error}</p>
            <p className="text-xs mt-2 text-muted-foreground">
              You can still fill out the form manually below.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export { DOIAutoFetch };
