import { env } from "@/env";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"section">;

function TailwindIndicator({ className, ...props }: Props) {
  if (env.NODE_ENV === "production") return null;
  return (
    <section
      className={cn(
        "fixed bottom-4 right-4 z-50 flex size-7 items-center justify-center rounded-full text-background bg-foreground p-2 font-mono text-sm",
        className
      )}
      {...props}
    >
      <div className="block xs:hidden">xx</div>
      <div className="hidden xs:block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        sm
      </div>
      <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</div>
      <div className="hidden lg:block xl:hidden 2xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </section>
  );
}

export { TailwindIndicator };
