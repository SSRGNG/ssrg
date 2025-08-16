import { HeroSection } from "@/components/shell/section";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof HeroSection>;

function Hero({ className, ...props }: Props) {
  return (
    <HeroSection
      className={cn(className)}
      header={{
        titleElement: "h1",
        hero: true,
        title: "Our Research Ethics",
        description: `At ${appConfig.name}, we are committed to conducting research that upholds the highest ethical standards. Our work is guided by principles that ensure respect for individuals, communities, and the integrity of the research process.`,
      }}
      {...props}
    />
  );
}

export { Hero };
