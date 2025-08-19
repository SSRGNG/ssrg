import { HeroSection } from "@/components/shell/section";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof HeroSection>;

function Hero({ className, ...props }: Props) {
  return (
    <HeroSection
      spacing={"snug"}
      className={cn(className)}
      header={{
        titleElement: "h1",
        hero: true,
        title: "Commitment to Ethical Research and Legal Compliance",
        description: `The Social Solutions Research Group is committed to conducting research that meets the highest standards of ethical integrity, legal compliance, and participant protection. Our policies ensure that all research activities respect human dignity, protect sensitive information, and comply with applicable laws and regulations.`,
      }}
      {...props}
    >
      <p className="text-muted-foreground text-left text-pretty bg-brand/5 p-4 sm:p-6 border rounded-lg shadow-sm">
        We believe that rigorous ethical standards and transparent policies are
        fundamental to conducting research that truly serves communities and
        advances social justice. Our compliance framework balances the need for
        open, accessible research with the protection of participant rights and
        sensitive information.
      </p>
    </HeroSection>
  );
}

export { Hero };
