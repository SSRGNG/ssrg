import Link from "next/link";

import { Icons, type Icons as IconType } from "@/components/shared/icons";
import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Resources({ className, ...props }: Props) {
  return (
    <Section
      spacing="snug"
      className={cn(className)}
      header={{
        title: "Research Resources",
        description:
          "We develop and share methodological tools, datasets, and frameworks to support rigorous social research.",
      }}
      {...props}
    >
      <div className="grid md:grid-cols-3 gap-4">
        <ResourceCard
          href="/resources/datasets"
          icon="database"
          title="Open Datasets"
          description="Access our publicly available research datasets, complete with documentation and analysis tools."
        />
        <ResourceCard
          href="/resources/toolkits"
          icon="tools"
          title="Research Toolkits"
          description="Methodological guides, survey instruments, and analysis frameworks for community-centered research."
        />
        <ResourceCard
          href="/resources/training"
          icon="graduationCap"
          title="Training Resources"
          description="Webinars, workshops, and learning materials on participatory research methods and approaches."
        />
      </div>

      <Link
        href="/resources"
        className={cn(
          buttonVariants({
            variant: "brand",
            className: "flex w-fit mx-auto",
          })
        )}
      >
        View All Resources
      </Link>
    </Section>
  );
}

function ResourceCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: IconType;
}) {
  const Icon = Icons[icon];
  return (
    <Card className="gap-4">
      <CardHeader className="grid-cols-[auto_1fr] grid-rows-[auto] items-center gap-2.5">
        <Icon strokeWidth={1.5} className="text-brand shrink-0" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <Link
          href={href}
          className={cn(
            buttonVariants({
              variant: "link",
              className: "w-fit h-fit text-brand p-0",
            })
          )}
        >
          {`Learn more →`}
        </Link>
      </CardContent>
    </Card>
  );
}

export { Resources };
