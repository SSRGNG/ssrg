import { LinkIcon } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/shell/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const data = [
  {
    title: "Terms of Use",
    description:
      "Legal framework governing access to and use of SSRG resources",
    href: "/policy/terms",
  },
  {
    title: "Privacy Policy",
    description: "Comprehensive protection of personal and research data",
    href: "/policy/privacy",
  },
  {
    title: "Data Protection",
    description: "Advanced security measures and data management protocols",
    href: "/policy/data-protection",
  },
];
type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Cards({ className, ...props }: Props) {
  return (
    <Section
      size={"small"}
      spacing={"snug"}
      header={{ title: "Policy Framework Overview" }}
      className={cn(className)}
      {...props}
    >
      <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3">
        {data.map((item, i) => (
          <Link
            href={item.href}
            key={item.title}
            className={cn(
              "grid relative",
              i === 2 && "xs:col-span-2 md:col-span-1"
            )}
          >
            <Card className={cn("gap-2.5 shadow-none")}>
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
      </div>
    </Section>
  );
}

export { Cards };
