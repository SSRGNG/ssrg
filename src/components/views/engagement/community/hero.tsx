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
          "Connecting research with communities through events and initiatives",
        description: `From public lectures and workshops to grassroots initiatives, our community activities bring research closer to the people it serves. These programs foster dialogue, build capacity, and ensure that knowledge is both accessible and actionable.`,
      }}
      {...props}
    />
  );
}

export { Hero };
