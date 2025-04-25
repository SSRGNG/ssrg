import "server-only";

import { auth_db } from "@/db";

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
