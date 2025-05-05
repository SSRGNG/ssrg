import { UserSignup } from "@/components/forms/user-signup";
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

function Signup({ className, ...props }: Props) {
  return (
    <Card className={cn("gap-5", className)} {...props}>
      <CardHeader>
        <CardTitle>{appConfig.auth.signup.title}</CardTitle>
        <CardDescription>{appConfig.auth.signup.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <UserSignup />
      </CardContent>
    </Card>
  );
}

export { Signup };
