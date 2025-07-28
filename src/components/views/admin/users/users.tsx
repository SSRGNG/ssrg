import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div">;

async function Users({ className, ...props }: Props) {
  return <div className={cn(className)} {...props}></div>;
}

export { Users };
