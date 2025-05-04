import { sql, SQLWrapper } from "drizzle-orm";

export function atLeastOneNotNull(...columns: SQLWrapper[]) {
  return sql`${sql.join(
    columns.map((c) => sql`${c} IS NOT NULL`),
    sql` OR `
  )}`;
}
