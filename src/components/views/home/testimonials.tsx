import { Section } from "@/components/shell/section";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

const testimonials = [
  {
    testimonial:
      "SSRG's research has fundamentally changed how we approach community development. Their data-driven insights are invaluable.",
    partner: {
      name: "Dr. Melda Z.",
      affiliation: "Community Solutions Institute",
    },
  },
  {
    testimonial:
      "Working with SSRG researchers has transformed our organization's approach to measuring impact. The methodologies they developed have become our gold standard.",
    partner: {
      name: "Marcus J. Williams",
      affiliation: "Urban Development Coalition",
    },
  },
];
function Testimonials({ className, ...props }: Props) {
  return (
    <Section
      spacing={"snug"}
      className={cn(className)}
      header={{ title: "What Partners Say" }}
      {...props}
    >
      <div className="grid xs:grid-cols-2 gap-4">
        {testimonials.slice(0, 2).map((t) => (
          <Card key={t.testimonial}>
            <CardContent className="space-y-4">
              <CardDescription className="italic">
                &ldquo;{t.testimonial}&rdquo;
              </CardDescription>
              <div className="grid gap-0.5 text-sm leading-tight">
                <span className="truncate font-semibold">{t.partner.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {t.partner.affiliation}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export { Testimonials };
