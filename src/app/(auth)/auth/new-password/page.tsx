import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPassword } from "@/components/forms/reset-password";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appConfig } from "@/config";

export const metadata: Metadata = {
  title: appConfig.auth.newPassword.title,
  description: appConfig.auth.newPassword.description,
};

export default function NewPasswordPage() {
  return (
    <Card className="gap-5">
      <CardHeader>
        <CardTitle>{appConfig.auth.newPassword.title}</CardTitle>
        <CardDescription>
          {appConfig.auth.newPassword.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <ResetPassword />
        </Suspense>
      </CardContent>
    </Card>
  );
}
