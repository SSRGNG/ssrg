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
import { research_framework } from "@/config/constants";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Framework({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{ title: "Research Framework" }}
      {...props}
    >
      <div className="grid gap-4 xs:grid-cols-2">
        {research_framework.map((framework) => (
          <Card key={framework.title} className="gap-2.5">
            <CardHeader className="gap-0">
              <CardTitle>{framework.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{framework.description}</p>
            </CardContent>
            <CardFooter className="grid">
              <Link
                aria-label={framework.link.text}
                href={framework.link.href}
                className={cn(
                  buttonVariants({
                    variant: "link",
                    className:
                      "text-brand px-0 whitespace-normal h-fit justify-start",
                  })
                )}
              >
                {framework.link.text}
              </Link>
            </CardFooter>
          </Card>
          // </Link>
        ))}
      </div>
    </Section>
  );
}

export { Framework };
