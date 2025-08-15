import { LinkIcon } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/shell/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCachedAdminResearchAreas } from "@/lib/queries/admin";
import { cn, mapResearchAreas } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

async function FocusAreas({ className, ...props }: Props) {
  const rawAreas = await getCachedAdminResearchAreas();
  const areas = mapResearchAreas(rawAreas);
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{
        title: "Research Focus Areas",
        description:
          "Our research addresses today's most pressing social challenges through three interconnected focus areas:",
      }}
      {...props}
    >
      <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3">
        {areas.map((area, i) => (
          <Link
            href={area.href}
            key={area.title}
            className={cn(
              "grid relative",
              i === 2 && "xs:col-span-2 md:col-span-1"
            )}
          >
            <Card className="gap-2.5">
              <CardHeader className="gap-0">
                <CardTitle>
                  {area.title}{" "}
                  <LinkIcon className="size-3 text-brand absolute top-4 right-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-pretty">
                  {area.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export { FocusAreas };
