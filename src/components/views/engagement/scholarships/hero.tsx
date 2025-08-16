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
        title: "Supporting and recognizing the next generation of researchers",
        description: `We support the next generation of researchers through scholarships, small grants, and recognition awards. These opportunities encourage innovative thinking, applied research, and knowledge mobilization in the social solutions space.`,
      }}
      {...props}
    />
  );
}

export { Hero };
