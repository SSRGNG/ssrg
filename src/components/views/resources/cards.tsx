import { LinkIcon } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/shell/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const data = [
  {
    title: "Methodologies",
    description:
      "Research frameworks and approaches tested in real-world applications",
    href: "/resources/methods",
  },
  {
    title: "Data Tools",
    description:
      "Software and analysis platforms for quantitative and qualitative research",
    href: "/resources/tools",
  },
  {
    title: "Field Guides",
    description: "Practical implementation guides for community-based research",
    href: "/resources/guides",
  },
];
type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Cards({ className, ...props }: Props) {
  return (
    <Section
      size={"small"}
      className={cn("grid gap-4 xs:grid-cols-2 md:grid-cols-3", className)}
      {...props}
    >
      {data.map((item, i) => (
        <Link
          href={item.href}
          key={item.title}
          className={cn(
            "grid relative",
            i === 2 && "xs:col-span-2 md:col-span-1"
          )}
        >
          <Card className={cn("gap-2.5 bg-brand/5 shadow-none")}>
            <CardHeader className="gap-0">
              <CardTitle>
                {item.title}{" "}
                <LinkIcon className="size-3 text-brand absolute top-4 right-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-pretty">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </Section>
  );
}

export { Cards };
