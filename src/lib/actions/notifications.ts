"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/auth";
import NewsletterWelcomeEmail from "@/components/emails/newsletter-welcome-email";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { env } from "@/env";
import { resend } from "@/lib/resend";
import {
  joinNewsletterSchema,
  type JoinNewsletterPayload,
} from "@/lib/validations/notification";

export async function subscribeToNewsletter(formData: JoinNewsletterPayload) {
  // Validate input
  try {
    const input = joinNewsletterSchema.parse(formData);

    // Check if already subscribed
    const notification = await db
      .select({
        id: notifications.id,
        newsletter: notifications.newsletter,
        email: notifications.email,
        token: notifications.token,
      })
      .from(notifications)
      .where(eq(notifications.email, input.email))
      .execute()
      .then((res) => res[0]);

    if (notification?.newsletter) {
      return {
        success: false,
        status: 409,
        message: "You are already subscribed to the newsletter.",
      };
    }

    const session = await auth();
    const user = session?.user;

    await Promise.all([
      resend.emails.send({
        from: env.EMAIL_FROM,
        to: input.email,
        subject: input.subject ?? "Welcome to SSRG",
        react: NewsletterWelcomeEmail({
          name: user?.name ?? "",
          fromEmail: env.EMAIL_FROM,
          token: notification?.token ?? input.token,
        }),
      }),
      db
        .insert(notifications)
        .values({
          email: input.email,
          token: input.token,
          newsletter: true,
        })
        .onConflictDoUpdate({
          target: [notifications.email],
          set: {
            newsletter: true,
          },
        }),
    ]);

    return { success: true, status: 200 };
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        status: 422,
        message: error.message,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        status: 500,
        message: error.message,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Something went wrong",
    };
  }
}
