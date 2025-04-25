import { Section } from "@/components/shell/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { research_methodologies } from "@/config/constants";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Methodologies({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{
        title: "Our Research Approach",
        description:
          "At SSRG, we believe in methodologically rigorous research that centers community voices and drives meaningful social change. Our approach combines:",
      }}
      {...props}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {research_methodologies.map((methodology) => (
          <Card key={methodology.title} className="gap-2.5">
            <CardHeader className="gap-0">
              <CardTitle>{methodology.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{methodology.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export { Methodologies };
