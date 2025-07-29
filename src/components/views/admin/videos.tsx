"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { videoCats } from "@/config/enums";
import { AdminVideosTypes } from "@/lib/actions/queries";
import { createChartConfig, createChartData } from "@/lib/chart-utils";
import { cn } from "@/lib/utils";
import { VideoCategory } from "@/types";

export const description = "A video categories donut chart";

type Props = React.ComponentPropsWithoutRef<typeof Card> & {
  videos: AdminVideosTypes;
};

// const mockD: AdminVideosTypes = [
//   { category: "Q&A", count: 4 },
//   { category: "conference_talk", count: 5 },
//   { category: "debate", count: 42 },
//   { category: "documentary", count: 24 },
//   { category: "interview", count: 14 },
//   { category: "lecture", count: 30 },
//   { category: "other", count: 4 },
//   { category: "panel_discussion", count: 12 },
//   { category: "presentation", count: 10 },
//   { category: "research_explanation", count: 14 },
//   { category: "tutorial", count: 18 },
//   { category: "webinar", count: 24 },
//   { category: "workshop", count: 9 },
//   { category: "debate", count: 4 },
//   { category: null, count: 10 },
// ];
const getCategoryLabel = (category: VideoCategory | null) => {
  if (category === null) return "Uncategorized";
  return videoCats.getLabel(category);
};

function Videos({ videos, className, ...props }: Props) {
  const videoData = videos.map((video) => ({
    count: video.count,
    category: getCategoryLabel(video.category),
  }));

  const chartData = createChartData(
    videoData,
    (video) => video.category,
    (video) => video.count,
    { dataKey: "count", nameKey: "category" }
  );

  const chartConfig = createChartConfig(videoData, (video) => video.category, {
    includeDataKeyConfig: true,
    dataKey: "count",
    dataKeyLabel: "Count",
    colorMode: "direct",
    palette: "vibrant",
  });

  const totalCount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className={cn("gap-0", className)} {...props}>
      <CardHeader>
        <CardTitle>Video Distribution</CardTitle>
        <CardDescription>Breakdown of videos by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square w-full max-h-[300px]"
        >
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              innerRadius={60}
              strokeWidth={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className={cn("fill-primary text-base font-bold")}
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 16}
                          className="fill-muted-foreground font-bold"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="flex-wrap gap-2.5 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { Videos };
