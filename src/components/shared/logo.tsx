import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href?: string;
};

function Logo({ href = "/", className, ...props }: Props) {
  return (
    <Link href={href} className={cn("text-brand", className)} {...props}>
      <Icons.logo aria-hidden="true" className="h-6" />
      {/* <span className="text-lg font-heading font-bold">{appConfig.name}</span> */}
      <span className="sr-only">Home</span>
    </Link>
  );
}

export { Logo };
