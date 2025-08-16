"use server";

import { eq, sql } from "drizzle-orm";
import { AuthError } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";

import { auth, signIn, signOut } from "@/auth";
import { db } from "@/db";
import {
  partners,
  researcherEducation,
  researcherExpertise,
  researchers,
  users,
} from "@/db/schema";
import { getUserByEmail } from "@/lib/queries/user";
import {
  hashPassword,
  isRoleAllowed,
  slugifyName,
  verifyPassword,
} from "@/lib/utils";
import {
  type CredentialsPayload,
  credentialsSchema,
  type SignupPayload,
  signupSchema,
  UpdateUserPayload,
  updateUserSchema,
} from "@/lib/validations/auth";
import { Role } from "@/types";

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
      // Generate a unique slug within the transaction
      const baseSlug = slugifyName(userData.name);
      let uniqueSlug = baseSlug;
      let counter = 1;

      // Find a unique slug
      while (true) {
        const existingUser = await tx.query.users.findFirst({
          where: (model, { eq }) => eq(model.slug, uniqueSlug),
        });

        if (!existingUser) {
          break; // Slug is available
        }

        // Slug exists, try with a number suffix
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

      return { userId, slug: uniqueSlug };
    });

    // Revalidate any pages that might need to reflect this change
    revalidatePath("/auth/signin");

    return {
      success: true,
      userId: result.userId,
      slug: result.slug,
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
    await db
      .update(users)
      .set(validatedData)
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

// Delete user
export async function deleteUser(userId: string) {
  try {
    const user = (await auth())?.user;
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        details: "User not authenticated",
      };
    }

    const allowedRole = isRoleAllowed(["admin"], user.role);
    if (!allowedRole) {
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
        details: "User ID is required and must be a valid string",
      };
    }

    // const [deletedUser] = await db.delete(users).where(eq(users.id, userId)).returning({id: users.id, name: users.name});

    // if (!deleteUser) throw new Error('Failed to delete user')

    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({ id: users.id, name: users.name });

    if (deleteUser.length === 0) throw new Error("Failed to delete user");

    const [result] = deletedUser;

    // Revalidate relevant paths
    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return {
      success: true,
      message: `User "${result.name}" deleted successfully`,
      deletedUser: {
        id: result.id,
        name: result.name,
      },
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

// Bulk operations
export async function bulkUpdateUserRole(userIds: string[], newRole: Role) {
  try {
    const user = (await auth())?.user;
    if (!user) {
      return {
        success: false as const,
        error: "Unauthorized",
        details: "User not authenticated",
      };
    }

    const allowedRole = isRoleAllowed(["admin"], user.role);
    if (!allowedRole) {
      return {
        success: false as const,
        error: "Unauthorized",
        details: "User does not have permission to delete a registered account",
      };
    }

    await db
      .update(users)
      .set({ role: newRole })
      .where(sql`${users.id} = ANY(${userIds})`);

    // Revalidate relevant paths
    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return {
      success: true as const,
      updatedCount: userIds.length,
    };
  } catch (error) {
    console.error("User role update error:", error);

    return {
      success: false as const,
      error: "Failed to update user roles",
    };
  }
}

export async function bulkDeleteUsers(userIds: string[]) {
  try {
    const user = (await auth())?.user;
    if (!user) {
      return {
        success: false as const,
        error: "Unauthorized",
        details: "User not authenticated",
      };
    }

    const allowedRole = isRoleAllowed(["admin"], user.role);
    if (!allowedRole) {
      return {
        success: false as const,
        error: "Unauthorized",
        details: "User does not have permission to delete a registered account",
      };
    }

    await db.delete(users).where(sql`${users.id} = ANY(${userIds})`);

    // Revalidate relevant paths
    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return {
      success: true as const,
      deletedCount: userIds.length,
    };
  } catch (error) {
    console.error("User deletion error:", error);

    return {
      success: false as const,
      error: "Failed to delete users",
    };
  }
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
