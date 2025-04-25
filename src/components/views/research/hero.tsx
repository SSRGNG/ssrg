import { HeroSection } from "@/components/shell/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { research_methodologies } from "@/config/constants";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof HeroSection>;

function Hero({ className, ...props }: Props) {
  return (
    <HeroSection className={cn(className)} {...props}>
      <h1 className="text-balance">
        Transforming Society Through Rigorous Evidence-Based Research
      </h1>
      <p className="text-balance text-base leading-normal text-muted-foreground">
        At SSRG, we believe in methodologically rigorous research that centers
        community voices and drives meaningful social change. Our approach
        combines:
      </p>
      <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3">
        {research_methodologies.map((methodology, i) => (
          <Card
            key={methodology.title}
            className={cn("gap-2.5", i === 2 && "xs:col-span-2 md:col-span-1")}
          >
            <CardHeader className="gap-0">
              <CardTitle className="text-sm uppercase tracking-normal">
                {methodology.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-pretty">
                {methodology.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </HeroSection>
  );
}

export { Hero };
