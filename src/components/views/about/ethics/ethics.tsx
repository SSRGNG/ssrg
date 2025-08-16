import { Icons } from "@/components/shared/icons";
import { Section } from "@/components/shell/section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Ethics({ className, ...props }: Props) {
  return (
    <Section spacing="snug" className={cn(className)} {...props}>
      <Card className="gap-4 bg-brand/5">
        <CardHeader className="grid-cols-[auto_1fr] gap-2.5 grid-rows-[auto]">
          <div className="bg-brand/20 size-11 rounded-full flex items-center justify-center mx-auto">
            <Icons.ethics strokeWidth={1.5} className="text-brand size-6" />
          </div>
          <CardTitle className="sr-only">Ethics</CardTitle>

          <CardDescription>
            All research projects undergo rigorous ethical review, and we
            maintain transparent practices throughout the research process—from
            design and data collection to analysis and dissemination.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-xl space-y-2.5">
            <h3>Our Ethical Principles:</h3>
            <ul className="list-disc space-y-1 pl-[1.125rem] text-muted-foreground text-sm">
              <li>Respect for autonomy and dignity</li>
              <li>Beneficence and non-maleficence</li>
              <li>Justice and equity</li>
              <li>Transparency and accountability</li>
              <li>Community engagement and reciprocity</li>
            </ul>
          </div>
          <div className="p-4 border rounded-xl space-y-2.5">
            <h3>Ethical Review Process:</h3>
            <ul className="list-disc space-y-1 pl-[1.125rem] text-muted-foreground text-sm">
              <li>Independent Ethics Committee approval</li>
              <li>Community consultation and input</li>
              <li>Ongoing ethical monitoring</li>
              <li>Data protection and privacy safeguards</li>
              <li>Transparent reporting of findings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}

export { Ethics };
