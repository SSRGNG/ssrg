"use server";

import { AuthError } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";

import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import {
  partners,
  researcherEducation,
  researcherExpertise,
  researchers,
  users,
} from "@/db/schema";
import { getUserByEmail } from "@/lib/queries/user";
import { hashPassword, verifyPassword } from "@/lib/utils";
import {
  type CredentialsPayload,
  credentialsSchema,
  type SignupPayload,
  signupSchema,
  UpdateUserPayload,
  updateUserSchema,
} from "@/lib/validations/auth";
import { Role } from "@/types";
import { eq, sql } from "drizzle-orm";

export const signinCredential = async (input: CredentialsPayload) => {
  const parsedCredentials = credentialsSchema.safeParse(input);
  if (!parsedCredentials.success) throw new Error("Enter correct credentials");

  try {
    await signIn("credentials", {
      ...parsedCredentials.data,
      // redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) return error.message;
    throw error;
  }
};

export async function createUser(formData: SignupPayload) {
  try {
    // Validate the incoming data
    const parsedResult = signupSchema.safeParse(formData);

    if (!parsedResult.success) {
      return {
        error: "Invalid input",
        details: parsedResult.error.format(),
      };
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

    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.email, userData.email),
    });

    if (existingUser) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await hashPassword(userData.password);

    // Start a transaction
    const result = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: userData.email,
          name: userData.name,
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
            }))
          );
        }

        if (education?.length) {
          await tx.insert(researcherEducation).values(
            education.map(({ education, order }) => ({
              researcherId,
              education,
              order,
            }))
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

      return { userId };
    });

    // Revalidate any pages that might need to reflect this change
    revalidatePath("/auth/signin");

    return {
      success: true,
      userId: result.userId,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error: "Internal server error",
    };
  }
}

export const unAuthenticate = async () => {
  try {
    await signOut();
    // await signOut({ redirectTo: "/" });
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

export async function invalidateCache(tag: string) {
  revalidateTag(tag);
}

// Update user
export async function updateUser(userId: string, updates: UpdateUserPayload) {
  try {
    const parsedResult = updateUserSchema.safeParse(updates);

    if (!parsedResult.success) {
      return {
        error: "Invalid input",
        details: parsedResult.error.format(),
      };
    }
    const validatedData = parsedResult.data;
    const result = await db
      .update(users)
      .set(validatedData)
      .where(eq(users.id, userId))
      .returning();

    return result[0];
  } catch (error) {
    console.error("Error updating user details:", error);
    throw new Error("Failed to update user details");
  }
}

// Delete user
export async function deleteUser(userId: string) {
  await db.delete(users).where(eq(users.id, userId));
}

// Bulk operations
export async function bulkUpdateUserRole(userIds: string[], newRole: Role) {
  await db
    .update(users)
    .set({ role: newRole })
    .where(sql`${users.id} = ANY(${userIds})`);
}

export async function bulkDeleteUsers(userIds: string[]) {
  await db.delete(users).where(sql`${users.id} = ANY(${userIds})`);
}

export async function getNonResearchers() {
  // try {
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
  // } catch (error) {
  //   console.error(error);
  // }
}
