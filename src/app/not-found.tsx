import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen min-h-svh grid place-content-center p-4">
      <Card className="gap-2.5">
        <CardHeader className="gap-0">
          <CardTitle>Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Could not find requested resource</CardDescription>
        </CardContent>
        <CardFooter>
          <Link
            href="/"
            className={cn(buttonVariants({ className: "w-full" }))}
          >
            Return Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
