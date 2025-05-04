import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  out: "./src/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
