import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"header"> & {
  children?: React.PropsWithChildren;
};

function Header({ children, className, ...props }: Props) {
  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-50 flex h-14 py-0.5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 border-b",
        className
      )}
      {...props}
    >
      <SidebarTrigger className="-ml-1.5" />
      {children}
    </header>
  );
}

export { Header };
