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
        title: "Pioneering and driving innovative social solutions",
        description: `Meet the core team of researchers, analysts, and staff who drive our studies and shape our findings. Our diverse expertise spans social policy, health, education, and technology—united by a passion for addressing complex social challenges.`,
      }}
      {...props}
    />
  );
}

export { Hero };
