import { Credentials } from "@/components/forms/credentials";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Card>;

function Signin({ className, ...props }: Props) {
  return (
    <Card className={cn("border-none shadow-none", className)} {...props}>
      <CardHeader className="space-y-1">
        <CardTitle>{appConfig.auth.signin.title}</CardTitle>
        <CardDescription>{appConfig.auth.signin.description}</CardDescription>
      </CardHeader>
      <Credentials className="px-6" />
    </Card>
  );
}

export { Signin };
