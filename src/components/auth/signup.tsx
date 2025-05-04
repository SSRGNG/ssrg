import { UserSignup } from "@/components/forms/user-signup";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Card>;

function Signup({ className, ...props }: Props) {
  return (
    <Card className={cn("border-none shadow-none", className)} {...props}>
      <CardHeader>
        <CardTitle>{appConfig.auth.signup.title}</CardTitle>
        <CardDescription>{appConfig.auth.signup.description}</CardDescription>
      </CardHeader>
      {/* <Credentials className="px-6" /> */}
      <UserSignup className="px-6" />
    </Card>
  );
}

export { Signup };
