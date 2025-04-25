import { CheckCircle, CircleDot, Globe, Repeat } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function ImpactMeasurement({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      header={{
        title: "How We Measure Impact",
        description:
          "Our comprehensive approach to impact measurement ensures our research translates into meaningful social change.",
      }}
      className={cn(className)}
      {...props}
    >
      <Card className="bg-brand/5 shadow-none">
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <ImpactBox
            icon={CircleDot}
            title="Outputs"
            description="Quantifiable products and deliverables resulting from our research activities"
          />
          <ImpactBox
            icon={Repeat}
            title="Outcomes"
            description="Changes in knowledge, attitudes, behaviors, and systems"
          />
          <ImpactBox
            icon={Globe}
            title="Impact"
            description="Long-term, sustainable changes in social conditions and well-being"
          />
        </CardContent>
      </Card>
      <Card className="bg-brand/5">
        <CardContent className="space-y-1">
          <h3>Our Impact Framework</h3>
          <p className="text-muted-foreground">
            We evaluate our research impact across multiple dimensions:
          </p>

          <div className="pt-3 grid sm:grid-cols-3 gap-4">
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
            ].map((item, idx) => (
              <div key={idx} className="flex items-start p-3 border rounded-xl">
                <CheckCircle className="text-brand size-3 mr-2.5 mt-1 shrink-0" />
                <div className="space-y-1">
                  <h4>{item.title}</h4>
                  <p className="text-muted-foreground text-xs">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
            <Link
              href="/impact"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className: "flex whitespace-normal h-full",
                })
              )}
            >
              Learn more about our impact measurement approach →
            </Link>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}

function ImpactBox({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{
    className?: string;
    strokeWidth: string | number | undefined;
  }>;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center space-y-1.5">
      <div className="bg-brand/20 size-14 rounded-full flex items-center justify-center mx-auto">
        <Icon className="size-8 text-brand" strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      <p className="text-muted-foreground text-balance">{description}</p>
    </div>
  );
}

export { ImpactMeasurement };
