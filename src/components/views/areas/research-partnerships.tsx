import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function ResearchPartnerships({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{
        title: "Research Partnerships",
        description:
          "We collaborate with a diverse range of organizations to ensure our research addresses real-world challenges and creates meaningful impact.",
      }}
      {...props}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <PartnershipCard
          title="Academic Partnerships"
          description="We collaborate with leading universities and research institutions to advance knowledge and develop innovative methodologies."
          logos={[
            "/images/placeholder/120/60",
            "/images/placeholder/120/60",
            "/images/placeholder/120/60",
            "/images/placeholder/120/60",
          ]}
        />
        <PartnershipCard
          title="Community Partners"
          description="We work alongside community organizations to ensure our research addresses priorities identified by those most affected by social challenges."
          logos={[
            "/images/placeholder/120/60",
            "/images/placeholder/120/60",
            "/images/placeholder/120/60",
            "/images/placeholder/120/60",
          ]}
        />
      </div>
      <Card className="bg-brand text-light gap-4 md:flex-row md:items-center">
        <CardHeader className="md:w-3/4 md:pr-0">
          <CardTitle>Interested in partnering with us?</CardTitle>
          <CardDescription className="text-light/70">
            We&apos;re always looking to collaborate with organizations that
            share our commitment to evidence-based social change.
          </CardDescription>
        </CardHeader>
        <CardContent className="md:w-1/4 md:pl-0">
          <Link
            href="/partnerships"
            className={cn(
              buttonVariants({
                variant: "default",
                className: "w-full bg-light text-brand hover:bg-light/90",
              })
            )}
          >
            Contact Us
          </Link>
        </CardContent>
      </Card>
    </Section>
  );
}

function PartnershipCard({
  title,
  description,
  logos,
}: {
  title: string;
  description: string;
  logos: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {logos.map((logo, idx) => (
          <div
            key={idx}
            className="bg-muted p-4 rounded-lg h-16 flex items-center justify-center"
          >
            <Image src={logo} alt="Logo" className="object-contain" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export { ResearchPartnerships };
