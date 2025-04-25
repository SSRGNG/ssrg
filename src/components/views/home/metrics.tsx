import { Section } from "@/components/shell/section";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Metrics({ className, ...props }: Props) {
  return (
    <Section
      className={cn("grid xs:grid-cols-2 gap-4 md:grid-cols-4", className)}
      {...props}
    >
      <Card className="bg-brand/5 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-brand text-3xl md:text-4xl font-bold">
            25+
          </CardTitle>
          <CardDescription>Research Projects</CardDescription>
        </CardHeader>
      </Card>
      <Card className="bg-brand/5 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-brand text-3xl md:text-4xl font-bold">
            40+
          </CardTitle>
          <CardDescription>Publications</CardDescription>
        </CardHeader>
      </Card>
      <Card className="bg-brand/5 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-brand text-3xl md:text-4xl font-bold">
            12
          </CardTitle>
          <CardDescription>Community Partners</CardDescription>
        </CardHeader>
      </Card>
      <Card className="bg-brand/5 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-brand text-3xl md:text-4xl font-bold">
            5K+
          </CardTitle>
          <CardDescription>Research Participants</CardDescription>
        </CardHeader>
      </Card>
    </Section>
  );
}

export { Metrics };
