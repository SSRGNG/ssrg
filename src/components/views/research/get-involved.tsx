import Link from "next/link";

import { Section } from "@/components/shell/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function GetInvolved({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      size={"small"}
      className={cn(className)}
      header={{
        title: "Get Involved",
        description:
          "Join our community of researchers and partners to create meaningful social change",
      }}
      {...props}
    >
      <div className="grid xs:grid-cols-2 gap-4">
        <Link
          arial-label="Collaborate with us"
          href={"/engagement/collaborate"}
          className={cn(
            buttonVariants({
              variant: "brand",
              size: "xl",
            })
          )}
        >
          Collaborate with us →
        </Link>
        <Link
          arial-label="Participate in research"
          href={"/engagement/participate"}
          className={cn(
            buttonVariants({
              size: "xl",
            })
          )}
        >
          Participate in research →
        </Link>
      </div>
    </Section>
  );
}

export { GetInvolved };
