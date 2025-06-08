import { Newsletter as NForm } from "@/components/forms/newsletter";
import { Section } from "@/components/shell/section";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Newsletter({ className, ...props }: Props) {
  return (
    <Section
      size={"small"}
      alignment={"center"}
      spacing={"snug"}
      className={cn(className)}
      header={{
        title: "Join Our Research Community",
        description:
          "Stay updated on our latest research, publications, and opportunities for collaboration.",
      }}
      {...props}
    >
      <NForm />
    </Section>
  );
}

export { Newsletter };
