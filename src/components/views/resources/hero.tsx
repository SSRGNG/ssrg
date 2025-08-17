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
        title: "Empowering Research Excellence Through Comprehensive Resources",
        description: `Our Research Resources hub provides researchers, practitioners, and collaborators with the tools, methodologies, and guidance needed to conduct rigorous social solutions research. From established frameworks to cutting-edge analysis tools, these resources support evidence-based approaches to addressing complex social challenges.`,
      }}
      {...props}
    />
  );
}

export { Hero };
