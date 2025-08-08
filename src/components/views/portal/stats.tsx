import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PortalUsersStatsResult } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"section"> & {
  userStatsResult: PortalUsersStatsResult;
};

function Stats({ userStatsResult, className, ...props }: Props) {
  const {
    publicationCount = 0,
    totalCitations = 0,
    videoCount = 0,
  } = userStatsResult.success ? userStatsResult.data : {};
  // const publicationCount = userStatsResult.success
  //   ? userStatsResult.data.publicationCount
  //   : 0;
  // const citationCount = userStatsResult.success
  //   ? userStatsResult.data.totalCitations
  //   : 0;
  // const videoCount = userStatsResult.success
  //   ? userStatsResult.data.videoCount
  //   : 0;

  const stats = [
    {
      title: "Publications",
      count: publicationCount,
      href: "/portal/publications",
      icon: "publications" as Icons,
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-600/10",
    },
    // {
    //   title: "Projects",
    //   count: 0,
    //   href: "/portal/projects",
    //   icon: "research" as Icons,
    //   textColor: "text-blue-600",
    //   bgColor: "bg-blue-600/10",
    // },
    {
      title: "Citations",
      count: totalCitations,
      href: "#",
      icon: "quote" as Icons,
      textColor: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
    {
      title: "Videos",
      count: videoCount,
      href: "/portal/videos",
      icon: "video" as Icons,
      textColor: "text-rose-600",
      bgColor: "bg-rose-600/10",
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
