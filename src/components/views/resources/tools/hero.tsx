import { Section } from "@/components/shell/section";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Hero({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      size={"small"}
      className={cn(className)}
      header={{
        titleElement: "h1",
        title: "Research Software and Platforms",
      }}
      {...props}
    ></Section>
  );
}

export { Hero };
