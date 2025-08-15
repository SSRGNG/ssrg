import { CheckCircle } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Framework({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{
        title: "Our Impact Framework",
        description:
          "We evaluate our research impact across multiple dimensions:",
      }}
      {...props}
    >
      <div className="grid gap-4 xs:grid-cols-2 sm:grid-cols-3">
        {[
          {
            title: "Academic Impact",
            description:
              "Citations, peer recognition, and advancement of knowledge in the field",
          },
          {
            title: "Policy Impact",
            description:
              "Influence on policy development, implementation, and evaluation at local, state, and national levels",
          },
          {
            title: "Practice Impact",
            description:
              "Adoption of research-informed approaches by practitioners and community organizations",
          },
          {
            title: "Social Impact",
            description:
              "Measurable improvements in community well-being, equity, and quality of life",
          },
          {
            title: "Capacity Impact",
            description:
              "Enhanced capabilities of communities and organizations to address social challenges",
          },
        ].map((framework, i) => (
          <Card
            key={framework.title + String(i)}
            className={cn("gap-0 flex-row items-start px-4 sm:px-6")}
          >
            <CheckCircle className="text-brand size-3 mr-2.5 mt-1 shrink-0" />
            <div className="space-y-1">
              <h4>{framework.title}</h4>
              <p className="text-muted-foreground text-xs">
                {framework.description}
              </p>
            </div>
          </Card>
        ))}
        <Link
          href="/publications"
          className={cn(
            buttonVariants({
              variant: "outline",
              className: "flex whitespace-normal h-full",
            })
          )}
        >
          Learn more through our published researches →
        </Link>
      </div>
    </Section>
  );
}

export { Framework };
