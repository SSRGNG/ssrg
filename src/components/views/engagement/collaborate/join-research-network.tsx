import { Join } from "@/components/forms/join";
import { Section } from "@/components/shell/section";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

type Props = React.ComponentProps<typeof Section>;

function JoinResearchNetwork({ className, ...props }: Props) {
  return (
    <Section
      spacing="snug"
      className={cn(className)}
      header={{
        title: "Join Our Research Network",
        description:
          "Membership is free and open to individuals and organizations committed to advancing social solutions.",
      }}
      {...props}
    >
      <ul className="space-y-1 text-sm">
        {[
          "Access to our research resources and toolkits",
          "Monthly research updates and emerging findings",
          "Invitations to webinars and research events",
          "Opportunities for research collaborations",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle className="size-4 text-brand mt-1" strokeWidth={1.5} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Join />
    </Section>
  );
}

export { JoinResearchNetwork };
