"use client";

import { AlertTriangle, Bug, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { layoutVariants, Shell } from "@/components/shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

// Define the allowed page types as a const assertion for type safety
const PAGE_TYPES = [
  "portal",
  "admin",
  "features",
  "users",
  "teams",
  "core",
] as const;

// Create a union type from the page types
type PageType = (typeof PAGE_TYPES)[number];

type ErrorPageConfig = VariantProps<typeof layoutVariants> & {
  pageType: PageType;
  consoleMessage: string;
  fallbackDescription: string;
  homeUrl: string;
  homeLabel: string;
};

const ERROR_CONFIGS: Record<string, ErrorPageConfig> = {
  portal: {
    pageType: "portal",
    consoleMessage: "Portal page error",
    fallbackDescription:
      "An unexpected error occurred while loading the portal data.",
    homeUrl: "/portal",
    homeLabel: "Go to Portal",
  },
  admin: {
    pageType: "admin",
    consoleMessage: "Admin page error",
    fallbackDescription:
      "An unexpected error occurred while loading the admin data.",
    homeUrl: "/admin",
    homeLabel: "Go to Admin Dashboard",
  },
  core: {
    pageType: "core",
    consoleMessage: "Core features page error",
    fallbackDescription:
      "An unexpected error occurred while loading the features data.",
    homeUrl: "/admin",
    homeLabel: "Go to Admin Dashboard",
  },
  users: {
    pageType: "users",
    consoleMessage: "Users management page error",
    fallbackDescription:
      "An unexpected error occurred while loading the users data.",
    homeUrl: "/admin",
    homeLabel: "Go to Admin Dashboard",
  },
  teams: {
    pageType: "teams",
    consoleMessage: "Teams management page error",
    fallbackDescription:
      "An unexpected error occurred while loading the teams data.",
    homeUrl: "/admin",
    homeLabel: "Go to Admin Dashboard",
  },
};

type ReusableErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  pageType: PageType;
};

function ReusableError({ error, reset, pageType }: ReusableErrorProps) {
  const config = ERROR_CONFIGS[pageType] || ERROR_CONFIGS.portal;
  const variant = config.variant || "portal";

  useEffect(() => {
    console.error(config.consoleMessage, error);
  }, [error, config.consoleMessage]);

  // Determine error type for better UX
  const isDatabaseError =
    error.message.includes("PostgresError") ||
    error.message.includes("GROUP BY") ||
    error.message.includes("aggregate function") ||
    error.message.includes("database");

  const isNetworkError =
    error.message.includes("fetch") ||
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("network");

  const getErrorInfo = () => {
    if (isDatabaseError) {
      return {
        title: "Database Error",
        description:
          "There was a problem with the database query. This is likely a temporary issue.",
        icon: <Bug className="size-5" />,
        suggestions: [
          "Try refreshing the page",
          "Check if the database is running",
          "Review the SQL query syntax",
        ],
      };
    }

    if (isNetworkError) {
      return {
        title: "Connection Error",
        description:
          "Unable to connect to the server. Please check your network connection.",
        icon: <AlertTriangle className="size-5" />,
        suggestions: [
          "Check your internet connection",
          "Try refreshing the page",
          "Contact support if the problem persists",
        ],
      };
    }

    return {
      title: "Something went wrong",
      description: config.fallbackDescription,
      icon: <AlertTriangle className="size-5" />,
      suggestions: [
        "Try refreshing the page",
        "Go back to the dashboard",
        "Contact support if the problem persists",
      ],
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <Shell
      variant={variant}
      className={cn(
        "grid gap-4 content-start max-w-3xl mx-auto w-full h-full p-8 sm:p-6"
      )}
    >
      {/* Error Display */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-destructive/10">
            {errorInfo.icon}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{errorInfo.title}</h2>
          <p className="text-muted-foreground">{errorInfo.description}</p>
        </div>

        {/* Suggestions */}
        <div className="text-left">
          <p className="text-sm font-medium mb-2">Try these solutions:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {errorInfo.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-muted-foreground flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button onClick={reset}>
          <RefreshCw className="size-4" />
          Try Again
        </Button>

        <Button
          variant="outline"
          onClick={() => (window.location.href = config.homeUrl)}
        >
          <Home className="size-4" />
          {config.homeLabel}
        </Button>
      </div>

      {/* Technical Details (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="grid w-full">
          <Alert className="text-left">
            <Bug className="size-4" />
            <AlertTitle>Developer Information</AlertTitle>
            <AlertDescription className="mt-2">
              <details className="group">
                <summary className="cursor-pointer hover:text-foreground select-none">
                  Error Details {error.digest && `(${error.digest})`}
                </summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <strong className="text-xs uppercase tracking-wide">
                      Message:
                    </strong>
                    <div className="mt-1 p-3 bg-muted/50 rounded-md border overflow-hidden">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">
                        {error.message}
                      </pre>
                    </div>
                  </div>

                  {error.stack && (
                    <div>
                      <strong className="text-xs uppercase tracking-wide">
                        Stack Trace:
                      </strong>
                      <div className="mt-1 p-3 bg-muted/50 rounded-md border overflow-hidden">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                          {error.stack}
                        </pre>
                      </div>
                    </div>
                  )}

                  {error.digest && (
                    <div>
                      <strong className="text-xs uppercase tracking-wide">
                        Error Digest:
                      </strong>
                      <div className="mt-1 p-2 bg-muted/50 rounded border">
                        <code className="text-xs font-mono break-all">
                          {error.digest}
                        </code>
                      </div>
                    </div>
                  )}

                  {/* Additional debugging info */}
                  <div className="pt-2 border-t">
                    <strong className="text-xs uppercase tracking-wide">
                      Environment:
                    </strong>
                    <div className="mt-1 p-2 bg-muted/50 rounded border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">Page Type:</span>
                          <div className="text-muted-foreground">
                            {config.pageType}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">User Agent:</span>
                          <div className="text-muted-foreground break-words">
                            {typeof navigator !== "undefined"
                              ? navigator.userAgent
                              : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Timestamp:</span>
                          <div className="text-muted-foreground">
                            {new Date().toISOString()}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">URL:</span>
                          <div className="text-muted-foreground break-all">
                            {typeof window !== "undefined"
                              ? window.location.href
                              : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Error Type:</span>
                          <div className="text-muted-foreground">
                            {error.constructor.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Shell>
  );
}

export { PAGE_TYPES, ReusableError };
