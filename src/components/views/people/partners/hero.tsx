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
        title: "Organizations collaborating with us to co-create impact",
        description: `Our partnerships extend across universities, civil society, government agencies, and international organizations. Together, we co-create solutions, strengthen capacity, and amplify the reach of social research for broader change.`,
      }}
      {...props}
    />
  );
}

export { Hero };
