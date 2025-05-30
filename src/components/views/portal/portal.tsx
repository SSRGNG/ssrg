import { db } from "@/db";
import { partners, projects, publications, researchers } from "@/db/schema";
import { cn } from "@/lib/utils";
import { sql } from "drizzle-orm";

type Props = React.ComponentProps<"section">;

async function Portal({ className, ...props }: Props) {
  const [totalProjects, totalPublications, totalResearchers, totalPartners] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(projects),
      db.select({ count: sql<number>`count(*)` }).from(publications),
      db.select({ count: sql<number>`count(*)` }).from(researchers),
      db.select({ count: sql<number>`count(*)` }).from(partners),
    ]);
  return <section className={cn(className)} {...props}></section>;
}

export { Portal };
