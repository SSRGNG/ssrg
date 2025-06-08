// import { sql } from "drizzle-orm";

import { Icons } from "@/components/shared/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { db } from "@/db";
// import { projects, publications } from "@/db/schema";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = React.ComponentProps<"section">;

async function Stats({ className, ...props }: Props) {
  // const [[totalProjects], [totalPublications]] = await Promise.all([
  //   db.select({ count: sql<number>`count(*)` }).from(projects),
  //   db.select({ count: sql<number>`count(*)` }).from(publications),
  // ]);

  const stats = [
    {
      title: "Publications",
      count: 0,
      // count: totalPublications.count,
      href: "/portal/publications",
      icon: "reports" as Icons,
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-600/10",
    },
    {
      title: "Projects",
      count: 0,
      // count: totalProjects.count,
      href: "/portal/projects",
      icon: "caseStudy" as Icons,
      textColor: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      title: "Citations",
      count: 0,
      href: "#",
      icon: "quote" as Icons,
      textColor: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
    {
      title: "Datasets",
      count: 0,
      href: "/portal/data",
      icon: "database" as Icons,
      textColor: "text-orange-600",
      bgColor: "bg-orange-600/10",
    },
  ];

  return (
    <section
      className={cn("grid xs:grid-cols-2 md:grid-cols-4 gap-4", className)}
      {...props}
    >
      {stats.map((stat, idx) => (
        <StatCard
          key={idx}
          title={stat.title}
          count={stat.count}
          href={stat.href}
          icon={stat.icon}
          textColor={stat.textColor}
          bgColor={stat.bgColor}
        />
      ))}

      {/* <StatCard
        title="Publications"
        value={totalPublications.count}
        href="/portal/publications"
      />
      <StatCard title="Datasets" value={0} href="/portal/data" /> */}
    </section>
  );
}

function StatCard({
  title,
  count,
  href,
  icon,
  textColor,
  bgColor,
}: {
  title: string;
  count: number;
  href: string;
  icon: Icons;
  textColor: string;
  bgColor: string;
}) {
  const Icon = Icons[icon];
  return (
    <Link href={href}>
      <Card className="gap-2.5 flex-row justify-between items-center">
        <CardHeader className="gap-0">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className={cn(textColor, "font-semibold text-2xl")}>
            {count}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className={cn(bgColor, "flex rounded-full p-3")}>
            <Icon className={cn(textColor)} strokeWidth={1.5} />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export { Stats };
