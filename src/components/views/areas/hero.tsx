import Image from "next/image";

import { Section } from "@/components/shell/section";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Hero({ className, ...props }: Props) {
  return (
    <Section
      padding={"hero"}
      className={cn("grid md:grid-cols-2 gap-4 items-center", className)}
      {...props}
    >
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-balance">Our Research Areas</h1>
        <p className="text-balance text-base md:text-lg leading-normal text-muted-foreground">
          Driving social innovation through methodologically rigorous,
          community-engaged research focused on today&apos;s most pressing
          challenges.
        </p>
      </div>
      <AspectRatio ratio={16 / 9}>
        <Image
          src={"/images/research/collaborating.webp"}
          alt={`Researchers collaborating`}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          fill
          className="object-cover rounded-lg"
          loading="lazy"
        />
      </AspectRatio>
    </Section>
  );
}

export { Hero };
