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
        title: "Sustain independent research that drives social change",
        description: `Help us sustain high-quality, independent research that informs social policy and practice. Contributions directly support fieldwork, data analysis, publications, and community engagement programs.`,
      }}
      {...props}
    />
  );
}

export { Hero };
