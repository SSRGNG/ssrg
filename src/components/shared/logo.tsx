import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href?: string;
};

function Logo({ href = "/", className, ...props }: Props) {
  return (
    <Link
      href={href}
      className={cn("inline-flex gap-1 text-brand", className)}
      {...props}
    >
      <Icons.logo aria-hidden="true" strokeWidth={1} />
      <span className="text-lg font-heading font-bold">{appConfig.name}</span>
      <span className="sr-only">Home</span>
    </Link>
  );
}

export { Logo };
