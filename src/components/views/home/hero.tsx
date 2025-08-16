import Link from "next/link";

import { HeroSection } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import { appFullName } from "@/config/constants";
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
          "Bridging research and practice to create meaningful social impact",
        description: `${appFullName} conducts rigorous research to develop evidence-based approaches for today's most pressing social challenges.`,
      }}
      {...props}
    >
      <div className="max-w-md mx-auto grid xs:grid-cols-2 gap-4">
        <Link
          href="/research"
          className={cn(buttonVariants({ size: "xl", variant: "brand" }))}
        >
          Explore Our Research
        </Link>
        <Link
          href="/engagement/participate"
          className={cn(buttonVariants({ size: "xl" }))}
        >
          Get Involved
        </Link>
      </div>
    </HeroSection>
  );
}

export { Hero };
