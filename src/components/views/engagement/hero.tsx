import { HeroSection } from "@/components/shell/section";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof HeroSection>;

function Hero({ className, ...props }: Props) {
  return (
    <HeroSection
      className={cn(className)}
      header={{
        titleElement: "h1",
        hero: true,
        title:
          "Discover ways to participate, and support our research for social good",
        description: `Research has the most impact when it’s shared, applied, and co-created. We welcome collaboration with academics, practitioners, policymakers, and community members who believe in research-driven social change.`,
      }}
      {...props}
    />
  );
}

export { Hero };
