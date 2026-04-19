import type { Metadata } from "next";

import { ForgotPassword } from "@/components/forms/forgot-password";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appConfig } from "@/config";

export const metadata: Metadata = {
  title: appConfig.auth.reset.title,
  description: appConfig.auth.reset.description,
};

export default function ForgotPasswordPage() {
  return (
    <Card className="gap-5">
      <CardHeader>
        <CardTitle>{appConfig.auth.reset.title}</CardTitle>
        <CardDescription>{appConfig.auth.reset.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPassword />
      </CardContent>
    </Card>
  );
}
