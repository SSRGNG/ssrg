import { Section } from "@/components/shell/section";
import { research_areas } from "@/config/constants";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Findings({ className, ...props }: Props) {
  const area = research_areas.find((a) => a.title == "Community Development");
  if (!area) return null;
  return (
    <Section
      spacing={"snug"}
      header={{ title: "Key Findings" }}
      className={cn(className)}
      {...props}
    >
      <ul className="grid gap-4 xs:grid-cols-2 md:grid-cols-3">
        {area.findings.map((finding, idx) => (
          <li
            className={cn(
              "text-sm italic text-muted-foreground bg-card p-3 sm:p-4 flex items-start rounded-xl border",
              idx === 2 && "xs:col-span-2 md:col-span-1"
            )}
            key={idx}
          >
            <Info className="text-brand size-4 mr-1.5 mt-1 shrink-0" />
            {finding}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { Findings };
