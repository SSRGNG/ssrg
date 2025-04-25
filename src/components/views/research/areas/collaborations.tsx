import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Collaborations({ className, ...props }: Props) {
  return (
    <Section
      padding={"medium"}
      spacing={"snug"}
      className={cn(className)}
      header={{
        title: "Research Collaborations",
        description:
          "Our research areas serve as platforms for collaboration with community partners, policymakers, and other research institutions. We welcome inquiries about partnership opportunities across any of our focus areas.",
      }}
      {...props}
    >
      <Link
        href="/engagement/collaborate"
        className={cn(
          buttonVariants({
            size: "xl",
            variant: "brand",
            className: "flex whitespace-normal w-fit mx-auto",
          })
        )}
      >
        Explore Collaboration Opportunities
      </Link>
    </Section>
  );
}

export { Collaborations };
