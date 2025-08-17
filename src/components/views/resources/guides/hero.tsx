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
        title: "Building Trust: A Researcher's Guide to Community Entry",
        description: `Comprehensive guide for researchers beginning work in new communities, with emphasis on ethical relationship building and cultural humility.`,
      }}
      {...props}
    />
  );
}

export { Hero };
