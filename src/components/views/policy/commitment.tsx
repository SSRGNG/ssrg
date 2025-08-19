import { Section } from "@/components/shell/section";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Commitment({ className, ...props }: Props) {
  return (
    <Section
      header={{
        title: "Our Commitment",
        description: `We believe that rigorous ethical standards and transparent policies are fundamental to conducting research that truly serves communities and advances social justice. Our compliance framework balances the need for open, accessible research with the protection of participant rights and sensitive information.`,
        descriptionClassName:
          "text-left text-pretty bg-brand/5 p-4 sm:p-6 border rounded-lg shadow-sm",
        className: "space-y-4",
      }}
      className={cn(className)}
      {...props}
    ></Section>
  );
}

export { Commitment };
