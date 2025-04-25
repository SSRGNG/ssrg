import { Section } from "@/components/shell/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Integration({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      header={{
        title: "Research Integration",
        description:
          "Our research areas are deeply interconnected. Many of our projects span multiple domains, reflecting the complex nature of social challenges and our holistic approach to addressing them.",
      }}
      className={cn(className)}
      {...props}
    >
      <div className="grid xs:grid-cols-2 gap-4">
        <Card className="gap-2.5">
          <CardHeader className="gap-0">
            <CardTitle>Cross-Cutting Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 list-disc pl-[1.125rem] text-sm text-muted-foreground">
              <li>Participatory research methodologies</li>
              <li>Intersectional approaches to social analysis</li>
              <li>Evidence-based intervention design</li>
              <li>Community-driven knowledge production</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="gap-2.5">
          <CardHeader className="gap-0">
            <CardTitle>Research Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 list-disc pl-[1.125rem] text-sm text-muted-foreground">
              <li>Policy recommendations and frameworks</li>
              <li>Community action tools and resources</li>
              <li>Intervention models and evaluations</li>
              <li>Capacity building resources for organizations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

export { Integration };
