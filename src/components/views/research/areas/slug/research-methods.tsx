import { Section } from "@/components/shell/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResearchAreasData } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type RAreaType = ResearchAreasData[number];
type Props = React.ComponentPropsWithoutRef<typeof Section> & {
  area: RAreaType | undefined;
};

function ResearchMethods({ area, className, ...props }: Props) {
  if (!area) return null;
  return (
    <Section
      padding={"medium"}
      spacing={"snug"}
      header={{
        title: "Research Methods",
        description: `Our approach to ${area.title} employs multiple methodologies to develop comprehensive understanding and effective solutions:`,
      }}
      className={cn(className)}
      {...props}
    >
      <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3">
        {area.methods.map((method, idx) => (
          <Card
            key={idx}
            className={cn(
              "gap-2.5",
              idx === 2 && "xs:col-span-2 md:col-span-1"
            )}
          >
            <CardHeader className={cn("gap-0")}>
              <CardTitle>{method.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{method.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export { ResearchMethods };
