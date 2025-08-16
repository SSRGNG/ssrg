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
        title: "Work with us on joint research and knowledge exchange",
        description: `Partner with us on research projects, data collection, and knowledge exchange. Whether you represent an institution or work independently, we invite you to join our research network and contribute to evidence-based solutions.`,
      }}
      {...props}
    />
  );
}

export { Hero };
