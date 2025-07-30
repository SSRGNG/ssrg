"use client";

import { formatDistanceToNowStrict } from "date-fns";

import { Icons } from "@/components/shared/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminRecent } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
// import { publications, videoCats } from "@/config/enums";

type Props = React.ComponentPropsWithoutRef<typeof Card> & {
  recent: AdminRecent;
};

const activityConfig = {
  publications: {
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    icon: "publications" as keyof typeof Icons,
    getAction: (type: string) => type,
  },
  video: {
    textColor: "text-rose-600",
    bgColor: "bg-rose-50",
    icon: "video" as keyof typeof Icons,
    getAction: (category: string) => category,
  },
  user: {
    textColor: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50",
    icon: "user" as keyof typeof Icons,
    getAction: (role: string) => role,
  },
  projects: {
    textColor: "text-purple-600",
    bgColor: "bg-purple-50",
    icon: "briefcase" as keyof typeof Icons,
    getAction: (project: string) => project,
  },
} as const;

function Recent({ recent, className, ...props }: Props) {
  const processedData = recent.map((item, index) => {
    const config = activityConfig[item.type as keyof typeof activityConfig];

    return {
      ...item,
      id: `${item.type}-${item.createdAt}-${index}`,
      ...config,
    };
  });

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className="grid-rows-[auto]">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {processedData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        ) : (
          processedData.map((item) => {
            const Icon = Icons[item.icon] || Icons.alert;

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
              >
                <div
                  className={cn("flex-shrink-0 p-2 rounded-full", item.bgColor)}
                >
                  <Icon className={cn("size-4", item.textColor)} />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-relaxed">
                      <span className="font-medium">
                        {item.userName || "Anonymous"}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {item.action}
                      </span>
                      {item.title && (
                        <span className="block font-medium text-foreground mt-1">
                          &quot;{item.title}&quot;
                        </span>
                      )}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNowStrict(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        {/* {data.map((d) => {
          const Icon = Icons[(d.type as Icons) ?? "alert"];
          return (
            <div
              key={d.type}
              className="flex items-start gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
            >
              <span className="flex-shrink-0">
                <Icon className={cn("size-4", d.textColor)} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">
                    {d.userName || "Anonymous"}
                  </span>{" "}
                  {d.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNowStrict(new Date(d.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          );
        })} */}
      </CardContent>
    </Card>
  );
}

export { Recent };
