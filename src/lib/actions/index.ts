"use server";

import { eq, sql } from "drizzle-orm";
import { AuthError } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";

import { auth, signIn, signOut } from "@/auth";
import {
  CACHED_FORMATTED_RESEARCHER,
  CACHED_FORMATTED_RESEARCHERS,
  CACHED_PROJECTS,
  CACHED_PUBLICATIONS,
  CACHED_RESEARCH_AREAS,
  CACHED_RESEARCH_FRAMEWORKS,
  CACHED_RESEARCH_METHODOLOGIES,
  CACHED_RESEARCHER,
  CACHED_RESEARCHERS,
  CACHED_VIDEOS,
} from "@/config/constants";
import { auth_db, db } from "@/db";
import {
  partners,
  researcherEducation,
  researcherExpertise,
  researchers,
  users,
  verificationTokens,
} from "@/db/schema";
import { env } from "@/env";
import { getUserByEmail, getUserById } from "@/lib/queries/user";
import {
  hashPassword,
  isRoleAllowed,
  slugifyName,
  verifyPassword,
} from "@/lib/utils";
import {
  type CredentialsPayload,
  credentialsSchema,
  passwordSchema,
  type SignupPayload,
  signupSchema,
  UpdateUserPayload,
  updateUserSchema,
} from "@/lib/validations/auth";
import { Role } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Next.js throws a special NEXT_REDIRECT error when `redirect()` or a
 * successful `signIn()` triggers a navigation. We must re-throw it so the
 * framework can handle the redirect; catching it and converting to a toast
 * is what caused the "NEXT_REDIRECT" toast bug.
 */
function isNextRedirectError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const digest = (error as { digest?: string }).digest ?? "";
  return (
    digest.startsWith("NEXT_REDIRECT") || error.message === "NEXT_REDIRECT"
  );
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

/**
 * Returns `{ error: string }` for credential failures so the client can
 * display a specific message without throwing (and therefore without the
 * "NEXT_REDIRECT" toast on success).
 *
 * On success, `signIn()` triggers a NEXT_REDIRECT which is re-thrown so
 * Next.js can handle the navigation — the caller should NOT catch that.
 */
export const signinCredential = async (
  input: CredentialsPayload,
): Promise<{ error: string } | undefined> => {
  const parsedCredentials = credentialsSchema.safeParse(input);
  if (!parsedCredentials.success) {
    return { error: "Please enter a valid email and password." };
  }

  const { email, password } = parsedCredentials.data;

  // Run checks BEFORE calling signIn so we can give specific messages.
  // authWithCredentials (called by the credentials authorize callback) also
  // does these checks, but its errors get swallowed by NextAuth into a generic
  // CredentialsSignin. Doing it here lets us surface them to the UI.
  const user = await getUserByEmail(email);
  if (!user || !user.password) {
    return {
      error:
        "No account found with that email address. Please check your email or sign up.",
    };
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return {
      error:
        "Incorrect password. Please try again or use 'Forgot password' to reset it.",
    };
  }

  // Credentials are valid — hand off to NextAuth. On success this throws a
  // NEXT_REDIRECT; we must re-throw it.
  try {
    await signIn("credentials", { ...parsedCredentials.data });
  } catch (error) {
    if (isNextRedirectError(error)) throw error; // ← let the redirect through
    if (error instanceof AuthError) {
      return { error: "Authentication failed. Please try again." };
    }
    throw error;
  }
};

export const unAuthenticate = async () => {
  try {
    await signOut();
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof AuthError) return error.message;
    throw error;
  }
};

/**
 * Used internally by NextAuth's `authorize` callback.
 * Errors thrown here are caught by NextAuth — keep them as-is.
 */
export const authWithCredentials = async (
  credentials: Partial<Record<"email" | "password", string>>,
) => {
  const parsedCredentials = credentialsSchema.safeParse(credentials);
  if (!parsedCredentials.success) return null;

  const { email, password } = parsedCredentials.data;

  const user = await getUserByEmail(email);
  if (!user || !user.password)
    throw new Error("Sorry, you do not have an account with us!");

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  return user;
};

// ─── Password management ──────────────────────────────────────────────────────

/**
 * Allows a logged-in user to change their own password.
 * Requires the current password to be verified first.
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be logged in." };

  const user = await getUserById(session.user.id);
  if (!user?.password) return { error: "User not found." };

  const isCurrentValid = await verifyPassword(currentPassword, user.password);
  if (!isCurrentValid) return { error: "Current password is incorrect." };

  const parsed = passwordSchema.safeParse({ password: newPassword });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (currentPassword === newPassword) {
    return {
      error: "New password must be different from your current password.",
    };
  }

  const hashed = await hashPassword(newPassword);
  await db.update(users).set({ password: hashed }).where(eq(users.id, user.id));

  return { success: true };
}

/**
 * Admin-only: set a new password for any user by their ID.
 * Useful as a manual workaround while Resend email is not fully configured.
 */
export async function adminChangeUserPassword(
  targetUserId: string,
  newPassword: string,
): Promise<{ success: true; userName: string } | { error: string }> {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated." };

  if (!isRoleAllowed(["admin"], session.user.role)) {
    return { error: "Only admins can change another user's password." };
  }

  const parsed = passwordSchema.safeParse({ password: newPassword });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const target = await getUserById(targetUserId);
  if (!target) return { error: "Target user not found." };

  const hashed = await hashPassword(newPassword);
  await db
    .update(users)
    .set({ password: hashed })
    .where(eq(users.id, targetUserId));

  revalidatePath("/admin");
  revalidatePath("/admin/users");

  return { success: true, userName: target.name };
}

// ─── Password reset (token-based, via Resend) ─────────────────────────────────

const RESET_PREFIX = "pwd-reset:";
const RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generates a reset token and (when Resend is configured) emails a link.
 * Always returns `{ success: true }` to prevent email enumeration.
 *
 * When Resend is NOT yet configured the token is logged to the server
 * console so you can manually supply the reset URL during development.
 */
export async function requestPasswordReset(
  email: string,
): Promise<{ success: true }> {
  const user = await getUserByEmail(email);
  if (!user) {
    // Don't reveal whether the email exists
    return { success: true };
  }

  // const token = crypto.randomBytes(32).toString("hex");
  // Generate 32 random bytes using Web Crypto API (works in Edge Runtime)
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const token = Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  const expires = new Date(Date.now() + RESET_EXPIRY_MS);
  const identifier = `${RESET_PREFIX}${email}`;

  // Remove any existing token for this email, then insert the new one.
  await auth_db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, identifier));

  await auth_db
    .insert(verificationTokens)
    .values({ identifier, token, expires });

  // TODO: replace the console.log with your Resend send call once the domain
  //       is verified. Import your email helper here when ready.
  const resetUrl = `${env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/new-password?token=${token}&email=${encodeURIComponent(email)}`;
  console.log("[DEV] Password reset URL:", resetUrl);

  // Example (uncomment when Resend is ready):
  // await resend.emails.send({
  //   from: env.EMAIL_FROM,
  //   to: email,
  //   subject: "Reset your password",
  //   react: <PasswordResetEmail name={user.name} resetUrl={resetUrl} />,
  // });

  return { success: true };
}

/**
 * Validates the reset token and sets the new password.
 */
export async function resetPasswordWithToken(
  email: string,
  token: string,
  newPassword: string,
): Promise<{ success: true } | { error: string }> {
  const identifier = `${RESET_PREFIX}${email}`;

  const record = await auth_db.query.verificationTokens.findFirst({
    where: (vt, { and, eq }) =>
      and(eq(vt.identifier, identifier), eq(vt.token, token)),
  });

  if (!record) {
    return {
      error: "Invalid or already-used reset link. Please request a new one.",
    };
  }

  if (record.expires < new Date()) {
    await auth_db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, identifier));
    return { error: "This reset link has expired. Please request a new one." };
  }

  const parsed = passwordSchema.safeParse({ password: newPassword });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const user = await getUserByEmail(email);
  if (!user) return { error: "User not found." };

  const hashed = await hashPassword(newPassword);
  await db.update(users).set({ password: hashed }).where(eq(users.id, user.id));

  // Consume the token so it can't be reused
  await auth_db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, identifier));

  return { success: true };
}

// ─── User CRUD ────────────────────────────────────────────────────────────────

export async function createUser(formData: SignupPayload) {
  try {
    const parsedResult = signupSchema.safeParse(formData);
    if (!parsedResult.success) {
      return { error: "Invalid input", details: parsedResult.error.format() };
    }

    const {
      role,
      title,
      bio,
      x,
      orcid,
      expertise,
      education,
      organization,
      logo,
      website,
      description,
      partnerType,
      ...userData
    } = parsedResult.data;

    const existingUser = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.email, userData.email),
    });
    if (existingUser) return { error: "Email already in use" };

    const hashedPassword = await hashPassword(userData.password);

    const result = await db.transaction(async (tx) => {
      const baseSlug = slugifyName(userData.name);
      let uniqueSlug = baseSlug;
      let counter = 1;

      while (true) {
        const existing = await tx.query.users.findFirst({
          where: (model, { eq }) => eq(model.slug, uniqueSlug),
        });
        if (!existing) break;
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      const [user] = await tx
        .insert(users)
        .values({
          email: userData.email,
          name: userData.name,
          slug: uniqueSlug,
          image: userData.image || null,
          password: hashedPassword,
          affiliation: userData.affiliation || null,
          role,
        })
        .returning();

      const userId = user.id;

      if (role === "researcher" && title && bio) {
        const [researcher] = await tx
          .insert(researchers)
          .values({
            userId,
            title,
            bio,
            x: x || null,
            orcid: orcid || null,
            featured: false,
          })
          .returning();

        const researcherId = researcher.id;

        if (expertise?.length) {
          await tx.insert(researcherExpertise).values(
            expertise.map(({ expertise, order }) => ({
              researcherId,
              expertise,
              order,
            })),
          );
        }
        if (education?.length) {
          await tx.insert(researcherEducation).values(
            education.map(({ education, order }) => ({
              researcherId,
              education,
              order,
            })),
          );
        }
      } else if (role === "partner" && organization && partnerType) {
        await tx.insert(partners).values({
          name: organization,
          logo: logo || null,
          website: website || null,
          description: description || `Partner organization: ${organization}`,
          partnerType,
          featured: false,
        });
      }

      return { userId, slug: uniqueSlug };
    });

    revalidatePath("/auth/signin");
    return { success: true, userId: result.userId, slug: result.slug };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Internal server error" };
  }
}

export const invalidateAllTags = async () => {
  try {
    revalidateTag(CACHED_FORMATTED_RESEARCHERS);
    revalidateTag(CACHED_RESEARCHERS);
    revalidateTag(CACHED_RESEARCH_AREAS);
    revalidateTag(CACHED_RESEARCHER);
    revalidateTag(CACHED_FORMATTED_RESEARCHER);
    revalidateTag(CACHED_RESEARCH_FRAMEWORKS);
    revalidateTag(CACHED_RESEARCH_METHODOLOGIES);
    revalidateTag(CACHED_PROJECTS);
    revalidateTag(CACHED_PUBLICATIONS);
    revalidateTag(CACHED_VIDEOS);
  } catch (error) {
    throw error;
  }
};

export async function invalidateCache(tag: string) {
  revalidateTag(tag);
}

export async function updateUser(userId: string, updates: UpdateUserPayload) {
  try {
    const parsedResult = updateUserSchema.safeParse(updates);
    if (!parsedResult.success) {
      return { error: "Invalid input", details: parsedResult.error.format() };
    }

    await db
      .update(users)
      .set(parsedResult.data)
      .where(eq(users.id, userId))
      .returning();

    revalidatePath("/admin");
    revalidatePath("/portal");
    revalidatePath("/portal/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating user details:", error);
    throw new Error("Failed to update user details");
  }
}

export async function deleteUser(userId: string) {
  try {
    const user = (await auth())?.user;
    if (!user)
      return {
        success: false,
        error: "Unauthorized",
        details: "User not authenticated",
      };

    if (!isRoleAllowed(["admin"], user.role)) {
      return {
        success: false,
        error: "Unauthorized",
        details: "User does not have permission to delete a registered account",
      };
    }

    if (!userId || typeof userId !== "string") {
      return {
        success: false,
        error: "Invalid user ID",
        details: "User ID is required",
      };
    }

    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({ id: users.id, name: users.name });

    if (deletedUser.length === 0) throw new Error("Failed to delete user");

    const [result] = deletedUser;

    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `User "${result.name}" deleted successfully`,
      deletedUser: { id: result.id, name: result.name },
    };
  } catch (error) {
    console.error("User deletion error:", error);
    return {
      success: false,
      error: "Failed to delete user",
      details: "An unexpected error occurred while deleting the user",
    };
  }
}

export async function bulkUpdateUserRole(userIds: string[], newRole: Role) {
  try {
    const user = (await auth())?.user;
    if (!user)
      return {
        success: false as const,
        error: "Unauthorized",
        details: "User not authenticated",
      };

    if (!isRoleAllowed(["admin"], user.role)) {
      return {
        success: false as const,
        error: "Unauthorized",
        details: "User does not have permission",
      };
    }

    await db
      .update(users)
      .set({ role: newRole })
      .where(sql`${users.id} = ANY(${userIds})`);

    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return { success: true as const, updatedCount: userIds.length };
  } catch (error) {
    console.error("User role update error:", error);
    return { success: false as const, error: "Failed to update user roles" };
  }
}

export async function bulkDeleteUsers(userIds: string[]) {
  try {
    const user = (await auth())?.user;
    if (!user)
      return {
        success: false as const,
        error: "Unauthorized",
        details: "User not authenticated",
      };

    if (!isRoleAllowed(["admin"], user.role)) {
      return {
        success: false as const,
        error: "Unauthorized",
        details: "User does not have permission",
      };
    }

    await db.delete(users).where(sql`${users.id} = ANY(${userIds})`);

    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return { success: true as const, deletedCount: userIds.length };
  } catch (error) {
    console.error("User deletion error:", error);
    return { success: false as const, error: "Failed to delete users" };
  }
}

export async function getNonResearchers() {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      affiliation: users.affiliation,
    })
    .from(users)
    .leftJoin(researchers, eq(users.id, researchers.userId))
    .orderBy(users.name);
}
