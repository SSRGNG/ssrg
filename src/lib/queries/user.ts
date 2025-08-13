import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { auth_db, db } from "@/db";
import { authors, partners, researchers, users } from "@/db/schema";

export interface UserProfiles {
  user: typeof users.$inferSelect;
  researcher?: typeof researchers.$inferSelect & {
    expertise: string[];
    education: string[];
    areas: Array<{ id: string; title: string }>;
  };
  author?: typeof authors.$inferSelect;
  partner?: typeof partners.$inferSelect;
}

export const getUserByEmail = async (email: string) => {
  try {
    return await auth_db.query.users.findFirst({
      where: (model, { eq }) => eq(model.email, email),
    });
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return await auth_db.query.users.findFirst({
      where: (model, { eq }) => eq(model.id, id),
    });
  } catch {
    return null;
  }
};

export async function getUserProfiles() {
  const authUser = (await auth())?.user;
  if (!authUser) redirect("/");

  const result = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
    with: {
      researcher: {
        with: {
          author: true,
          education: true,
          expertise: true,
          areas: { with: { area: true } },
        },
      },
    },
  });
  if (!result) throw new Error("User not found");

  return {
    user: result,
    ...(result.researcher && {
      researcher: {
        ...result.researcher,
        expertise: result.researcher.expertise
          .sort((a, b) => a.order - b.order)
          .map((e) => e.expertise),
        education: result.researcher.education
          .sort((a, b) => a.order - b.order)
          .map((e) => e.education),
        areas: result.researcher.areas.map((ra) => ({
          id: ra.area.id,
          title: ra.area.title,
          image: ra.area.image,
          description: ra.area.description,
          icon: ra.area.icon,
          detail: ra.area.detail,
          href: ra.area.href,
          linkText: ra.area.linkText,
        })),
      },
      ...(result.researcher.author && {
        author: result.researcher.author,
      }),
    }),
  };
}
