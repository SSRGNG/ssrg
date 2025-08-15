"use client";

import { ReusableError } from "@/components/shared/reusable-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ReusableError error={error} reset={reset} pageType="video" />;
}
