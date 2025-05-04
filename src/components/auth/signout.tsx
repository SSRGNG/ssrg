import { SignoutButton } from "@/components/auth/signout-button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Card>;

function Signout({ className, ...props }: Props) {
  return (
    <Card className={cn("border-none shadow-none", className)} {...props}>
      <CardHeader>
        <CardTitle>{appConfig.auth.signout.title}</CardTitle>
        <CardDescription>{appConfig.auth.signout.description}</CardDescription>
      </CardHeader>
      <SignoutButton />
    </Card>
  );
}

export { Signout };
