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
import { publications } from "@/config/enums";
import { AdminPubTypes } from "@/lib/actions/queries";
import { createChartConfig, createChartData } from "@/lib/chart-utils";
import { cn } from "@/lib/utils";

export const description = "A publications donut chart";

type Props = React.ComponentPropsWithoutRef<typeof Card> & {
  pubs: AdminPubTypes;
};

function Publication({ pubs, className, ...props }: Props) {
  const pubData = pubs.map((pub) => ({
    count: pub.count,
    type: publications.getLabel(pub.type),
  }));
  const chartData = createChartData(
    pubData,
    (pub) => pub.type,
    (pub) => pub.count,
    { dataKey: "count", nameKey: "type" }
  );

  const chartConfig = createChartConfig(pubData, (pub) => pub.type, {
    includeDataKeyConfig: true,
    dataKey: "count",
    dataKeyLabel: "Count",
  });

  // const chartData = [
  //   { type: "journal", count: 2, fill: "var(--color-journal)" },
  //   { type: "conference", count: 5, fill: "var(--color-conference)" },
  //   { type: "report", count: 3, fill: "var(--color-report)" },
  // ];
  // const chartConfig = {
  //   count: { label: "Count" },
  //   journal: { label: "Journal Article", color: "var(--chart-2)" },
  //   conference: { label: "Conference Paper", color: "var(--chart-3)" },
  //   report: { label: "Report", color: "var(--chart-4)" },
  // } satisfies ChartConfig;

  const totalCount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card className={cn("gap-0", className)} {...props}>
      <CardHeader>
        <CardTitle>Publication Distribution</CardTitle>
        <CardDescription>Breakdown of publications by type</CardDescription>
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
              nameKey="type"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              // label
              // label={({ count }) =>
              //   formatNumber(count, { notation: "compact" })
              // }
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
              content={<ChartLegendContent nameKey="type" />}
              className="flex-wrap gap-2.5 [&>*]:justify-center"
              // className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { Publication };
