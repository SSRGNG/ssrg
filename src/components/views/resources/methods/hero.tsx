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
        title: "Tested and proven guiding methodologies",
        description: `Our methodological frameworks have been developed and refined through years of community-engaged research. These approaches prioritize ethical research practices, community ownership of data, and actionable outcomes that drive social change.`,
      }}
      {...props}
    />
  );
}

export { Hero };
