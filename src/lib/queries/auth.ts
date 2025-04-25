import "server-only";

import { auth } from "@/auth";
import { cache } from "react";

export const getCachedSession = cache(async () => {
  try {
    return await auth();
  } catch (err) {
    console.error(err);
    return null;
  }
});
