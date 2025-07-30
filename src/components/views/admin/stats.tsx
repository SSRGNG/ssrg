import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminStats } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"section">;

async function Stats({ className, ...props }: Props) {
  const adminStats = await getAdminStats();

  const {
    totalUsers = 0,
    totalPublications = 0,
    totalProjects = 0,
    totalAreas = 0,
    activeResearchers = 0,
    totalVideos = 0,
  } = adminStats.success ? adminStats.data : {};

  const stats = [
    {
      title: "Users",
      count: totalUsers,
      href: "/admin/users",
      icon: "users" as Icons,
      textColor: "text-fuchsia-600",
      bgColor: "bg-fuchsia-600/10",
    },
    {
      title: "Researchers",
      count: activeResearchers,
      href: "#",
      icon: "award" as Icons,
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-600/10",
    },
    {
      title: "Publications",
      count: totalPublications,
      href: "#",
      icon: "publications" as Icons,
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-600/10",
    },
    {
      title: "Videos",
      count: totalVideos,
      href: "#",
      icon: "video" as Icons,
      textColor: "text-rose-600",
      bgColor: "bg-rose-600/10",
    },
    {
      title: "Projects",
      count: totalProjects,
      href: "/admin/core",
      icon: "projects" as Icons,
      textColor: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
    {
      title: "Research Areas",
      count: totalAreas,
      href: "/admin/core",
      icon: "focusAreas" as Icons,
      textColor: "text-amber-600",
      bgColor: "bg-amber-600/10",
    },
  ];
  return (
    <section
      className={cn(
        "grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
        className
      )}
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
      <Card className="gap-1 flex-row justify-between items-center">
        <CardHeader className="gap-0 pr-0 sm:pr-0 flex-1">
          <CardTitle className="text-sm sm:text-base">{title}</CardTitle>
          <CardDescription className={cn(textColor, "font-semibold text-2xl")}>
            {count}
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-0 sm:pl-0">
          <span className={cn(bgColor, "flex rounded-full p-3")}>
            <Icon className={cn("size-4", textColor)} strokeWidth={1.5} />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export { Stats };
