import { Credentials } from "@/components/forms/credentials";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Card>;

function Signin({ className, ...props }: Props) {
  return (
    <Card className={cn("gap-5", className)} {...props}>
      <CardHeader>
        <CardTitle>{appConfig.auth.signin.title}</CardTitle>
        <CardDescription>{appConfig.auth.signin.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Credentials />
      </CardContent>
    </Card>
  );
}

export { Signin };
