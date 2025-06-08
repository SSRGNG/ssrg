import { Icons } from "@/components/shared/icons";
import { Section } from "@/components/shell/section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Interconnections({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{
        title: "How Our Research Areas Interconnect",
        description:
          "Our research areas—Community Development, Social Policy Analysis, and Equity & Inclusion—work together to address complex social challenges.",
      }}
      {...props}
    >
      <AspectRatio ratio={24 / 9}>
        <Icons.interconnections
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full text-light/20 rounded-lg"
        />
      </AspectRatio>
      <p className="text-balance text-sm text-center text-muted-foreground">
        Insights from each area shape and strengthen the others, creating a
        holistic approach to social change.
      </p>
    </Section>
  );
}

export { Interconnections };
