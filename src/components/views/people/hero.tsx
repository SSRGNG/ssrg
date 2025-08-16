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
          "A community of researchers, members, and partners working together to create evidence-based social change",
        description: `Behind every project is a community of people dedicated to advancing social solutions. Our network includes researchers, practitioners, and partners who share a commitment to evidence-based approaches that create meaningful impact.`,
      }}
      {...props}
    />
  );
}

export { Hero };
