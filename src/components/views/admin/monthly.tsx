"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AdminMonthlies } from "@/lib/actions/queries";
import { cn, formatNumber } from "@/lib/utils";

const chartConfig = {
  publications: {
    label: "Publications",
    color: "var(--chart-1)",
  },
  videos: {
    label: "Videos",
    color: "var(--chart-2)",
  },
  users: {
    label: "Users",
    color: "var(--chart-3)",
  },
  projects: {
    label: "Projects",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type Props = React.ComponentPropsWithoutRef<typeof Card> & {
  monthly: AdminMonthlies;
};

function Monthly({ monthly, className, ...props }: Props) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className="grid-rows-[auto]">
        <CardTitle>Monthly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="max-h-[200px] w-full"
          // className="aspect-auto min-h-[200px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={monthly}
            margin={{
              top: 8,
              left: -5,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
              tickFormatter={(value) =>
                formatNumber(value, { notation: "compact" })
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="publications"
              type="natural"
              stroke="var(--color-publications)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-publications)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="videos"
              type="natural"
              stroke="var(--color-videos)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-videos)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="users"
              type="natural"
              stroke="var(--color-users)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-users)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="projects"
              type="natural"
              stroke="var(--color-projects)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-projects)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { Monthly };
