"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { getUserByEmail } from "@/lib/queries/user";
import { verifyPassword } from "@/lib/utils";
import {
  type CredentialsPayload,
  credentialsSchema,
} from "@/lib/validations/auth";

export const signinCredential = async (input: CredentialsPayload) => {
  const parsedCredentials = credentialsSchema.safeParse(input);
  if (!parsedCredentials.success) throw new Error("Enter correct credentials");

  try {
    await signIn("credentials", {
      ...parsedCredentials.data,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) return error.message;
    throw error;
  }
};

export const unAuthenticate = async () => {
  try {
    await signOut({ redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) return error.message;
    throw error;
  }
};
export const authWithCredentials = async (
  credentials: Partial<Record<"email" | "password", string>>
) => {
  // Parse and validate the input
  const parsedCredentials = credentialsSchema.safeParse(credentials);
  if (!parsedCredentials.success) return null;

  const { email, password } = parsedCredentials.data;

  // Retrieve the user from the database based on the email
  const user = await getUserByEmail(email);
  if (!user || !user.password)
    throw new Error("Sorry, you do not have an account with us!");
  // if (!user.emailVerified)
  //   throw new Error("You must verify your account first before signing in!");

  // Check if the password is valid
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  return user;
};
