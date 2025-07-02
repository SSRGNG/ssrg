import Link from "next/link";

import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCachedAdminResearchAreas } from "@/lib/queries/admin";
import { cn, mapResearchAreas } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

async function ResearchAreas({ className, ...props }: Props) {
  const rawAreas = await getCachedAdminResearchAreas();
  const areas = mapResearchAreas(rawAreas);

  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{
        title: "Our Research Focus Areas",
        description:
          "Exploring innovative solutions to complex social challenges through methodologically rigorous and community-engaged research.",
      }}
      {...props}
    >
      <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3">
        {areas.map((area, i) => (
          <Card
            key={area?.title}
            className={cn("gap-2.5", i === 2 && "xs:col-span-2 md:col-span-1")}
          >
            <CardHeader className={cn("gap-0")}>
              <CardTitle>{area?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{area?.description}</p>
            </CardContent>
            <CardFooter>
              <Link
                href={area?.href || ""}
                className={cn(
                  buttonVariants({
                    variant: "link",
                    className: "h-fit text-brand p-0",
                  })
                )}
              >
                Learn more →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export { ResearchAreas };
