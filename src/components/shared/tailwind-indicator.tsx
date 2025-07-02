import { env } from "@/env";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"section">;

function TailwindIndicator({ className, ...props }: Props) {
  if (env.NODE_ENV === "production") return null;
  return (
    <section
      className={cn(
        "fixed bottom-4 right-4 z-50 size-9 border border-ring flex items-center justify-center rounded-full text-background bg-foreground p-2 text-sm font-semibold cursor-pointer",
        className
      )}
      {...props}
    >
      <span className="block xxs:hidden">base</span>
      <span className="hidden xxs:block xsm:hidden">xxs</span>
      <span className="hidden xsm:block xs:hidden">xsm</span>
      <span className="hidden xs:block sm:hidden">xs</span>
      <span className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        sm
      </span>
      <span className="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</span>
      <span className="hidden lg:block xl:hidden 2xl:hidden">lg</span>
      <span className="hidden xl:block 2xl:hidden">xl</span>
      <span className="hidden 2xl:block">2xl</span>
    </section>
  );
}

export { TailwindIndicator };
