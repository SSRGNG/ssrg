import { HeroSection } from "@/components/shell/section";
import { appName } from "@/config/constants";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof HeroSection>;

function Hero({ className, ...props }: Props) {
  return (
    <HeroSection
      spacing={"tighter"}
      padding={"default"}
      className={cn(className)}
      header={{
        hero: true,
        title: `${appName} - Data Protection Standards`,
      }}
      {...props}
    >
      <div className="text-xs flex gap-1.5 flex-wrap justify-between">
        <span className="">Document Version: 1.0</span>
        <span className="">Last Updated: 19 Aug 2025</span>
      </div>
    </HeroSection>
  );
}

export { Hero };
