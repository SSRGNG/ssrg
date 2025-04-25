import { neon } from "@neondatabase/serverless";
import { drizzle as auth_drizzle } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";
import { env } from "@/env";

const auth_client = neon(env.DATABASE_URL);
const client = postgres(env.DATABASE_URL);

export const auth_db = auth_drizzle(auth_client, { schema });
export const db = drizzle(client, { schema });
