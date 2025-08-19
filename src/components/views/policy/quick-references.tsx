import { Section } from "@/components/shell/section";
import { cn } from "@/lib/utils";

const data = [
  {
    title: "IRB Approval",
    description: "All research projects undergo ethical review",
  },
  {
    title: "Data Security",
    description: "Multi-layer protection for all research data",
  },
  {
    title: "Participant Rights",
    description: "Clear protocols for informed consent and withdrawal",
  },
  {
    title: "Legal Compliance",
    description: "Adherence to federal, state, and international regulations",
  },
];
type Props = React.ComponentPropsWithoutRef<typeof Section>;

function QuickReferences({ className, ...props }: Props) {
  return (
    <Section
      size={"small"}
      spacing={"snug"}
      header={{ title: "Policy Framework Overview" }}
      className={cn(className)}
      {...props}
    >
      <ul className="space-y-1 list-none">
        {data.map((r, i) => (
          <li
            className="text-xs text-muted-foreground truncate border-l-2 pl-2 border-brand"
            key={i}
          >
            <span className="font-semibold">{r.title}:</span>{" "}
            <span>{r.description}</span>
          </li>
        ))}
      </ul>
      {/* {data.map((item, i) => (
        <Card
          key={i}
          className={cn(
            "grid gap-2.5 bg-brand/5 shadow-none relative",
            i === 2 && "xs:col-span-2 md:col-span-1"
          )}
        >
          <CardHeader className="gap-0">
            <CardTitle>
              {item.title}{" "}
              <LinkIcon className="size-3 text-brand absolute top-4 right-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-pretty">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))} */}
    </Section>
  );
}

export { QuickReferences };
