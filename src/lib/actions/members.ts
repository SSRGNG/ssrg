"use server";

import { db } from "@/db";
import { members, users } from "@/db/schema";
import { hashPassword, slugifyName } from "@/lib/utils";
import { joinSchema, type JoinPayload } from "@/lib/validations/partner";

export async function createMember(formData: JoinPayload) {
  const parsed = joinSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, affiliation, interests, type } = parsed.data;

  try {
    const result = await db.transaction(async (tx) => {
      // Generate a unique slug within the transaction
      const baseSlug = slugifyName(name);
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

      const hashedPassword = await hashPassword(uniqueSlug);

      // Create a user record first
      const [user] = await tx
        .insert(users)
        .values({
          name,
          email,
          affiliation: affiliation ?? null,
          slug: uniqueSlug,
          image: null,
          password: hashedPassword,
          role: "member",
        })
        .returning();

      // Create corresponding member record
      await tx.insert(members).values({
        userId: user.id,
        type,
        interests: interests ?? [],
      });

      return { userId: user.id, slug: uniqueSlug };
    });

    return {
      success: true,
      userId: result.userId,
      slug: result.slug,
    };
  } catch (error) {
    console.error("Error creating member:", error);
    return { success: false, error: "Something went wrong" };
  }
}
