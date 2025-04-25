import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { research_areas } from "@/config/constants";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function ResearchAreas({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{
        title: "Primary Research Areas",
      }}
      {...props}
    >
      {research_areas.map((area, i) => (
        <Card
          key={area.title}
          className={cn(
            "gap-0 py-0 overflow-hidden",
            i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          )}
        >
          <CardHeader className="px-0 md:w-2/5 grid-rows-[auto]">
            <Image
              src={area.image}
              alt={`Image for ${area.title}`}
              height={800}
              width={450}
              className="h-full w-full object-cover aspect-[24/9] "
              loading="lazy"
            />
          </CardHeader>
          <CardContent className="space-y-2.5 pt-4 md:pt-6 pb-6 md:w-3/5">
            <CardTitle className="flex items-center gap-2.5">
              <area.icon className="text-brand" strokeWidth={1.5} />
              {area.title}
            </CardTitle>
            <p>{area.detail}</p>
            <h4>Key Research Questions:</h4>
            <ul className="space-y-1 pl-[1.125rem] pb-2.5 list-disc">
              {area.questions.map((q, i) => (
                <li className="text-sm text-muted-foreground" key={i}>
                  {q}
                </li>
              ))}
            </ul>
            <Link
              href={area.href}
              className={cn(
                buttonVariants({
                  variant: "brand",
                  className: "whitespace-normal h-fit",
                })
              )}
            >
              {area.linkText}
            </Link>
          </CardContent>
        </Card>
      ))}
    </Section>
  );
}

export { ResearchAreas };
