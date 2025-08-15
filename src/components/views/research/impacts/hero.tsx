import { CircleDot, Globe, Repeat } from "lucide-react";

import { HeroSection } from "@/components/shell/section";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof HeroSection>;

const impactMeasurement = [
  {
    title: "Outputs",
    description:
      "Quantifiable products and deliverables resulting from our research activities",
    icon: CircleDot,
  },
  {
    title: "Outcomes",
    description: "Changes in knowledge, attitudes, behaviors, and systems",
    icon: Repeat,
  },
  {
    title: "Impact",
    description:
      "Long-term, sustainable changes in social conditions and well-being",
    icon: Globe,
  },
];
function Hero({ className, ...props }: Props) {
  return (
    <HeroSection className={cn(className)} {...props}>
      <h1 className="text-balance">How We Measure Impact</h1>
      <p className="text-balance text-base leading-normal text-muted-foreground">
        Our comprehensive approach to impact measurement ensures our research
        translates into meaningful social change.
      </p>
      <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3">
        {impactMeasurement.map((impact, i) => (
          <Card
            key={impact.title}
            className={cn(
              "gap-1.5 bg-brand/5 shadow-none",
              i === 2 && "xs:col-span-2 md:col-span-1"
            )}
          >
            <div className="bg-brand/20 size-14 rounded-full flex items-center justify-center mx-auto">
              <impact.icon className="size-8 text-brand" strokeWidth={1.5} />
            </div>
            <h3>{impact.title}</h3>
            <p className="text-muted-foreground text-balance">
              {impact.description}
            </p>
          </Card>
        ))}
      </div>
    </HeroSection>
  );
}

export { Hero };
