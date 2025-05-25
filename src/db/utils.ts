import { SQL, sql, SQLWrapper } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

export function atLeastOneNotNull(...columns: SQLWrapper[]) {
  return sql`${sql.join(
    columns.map((c) => sql`${c} IS NOT NULL`),
    sql` OR `
  )}`;
}

export function lower(title: AnyPgColumn): SQL {
  return sql`lower(${title})`;
}
