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
          "Affiliated scholars and practitioners enriching our research network",
        description: `We collaborate with affiliated researchers, practitioners, and students who enrich our work with their knowledge and lived experience. Members play an active role in joint research, peer learning, and dissemination of insights.`,
      }}
      {...props}
    />
  );
}

export { Hero };
