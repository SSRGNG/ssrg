import Link from "next/link";

import { HeroSection } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof HeroSection>;

function Hero({ className, ...props }: Props) {
  return (
    <HeroSection className={cn(className)} {...props}>
      <h1 className="text-balance">
        Bridging research and practice to create meaningful social impact
      </h1>
      <p className="text-balance text-base leading-normal text-muted-foreground">
        Social Solutions Research Group conducts rigorous research to develop
        evidence-based approaches for today&apos;s most pressing social
        challenges.
      </p>
      {/* <div className="flex flex-col sm:flex-row justify-center gap-4"> */}
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
