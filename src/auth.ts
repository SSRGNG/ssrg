import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";

import { appConfig } from "@/config";
import { auth_db } from "@/db";
import { users } from "@/db/schema";
import { env } from "@/env";
import { authWithCredentials } from "@/lib/actions";
import { getUserById } from "@/lib/queries/user";
import type { Role } from "@/types";
import { eq } from "drizzle-orm";

type AddOns = {
  role: Role;
};
export type AuthUser = DefaultSession["user"] & AddOns;

declare module "next-auth" {
  interface Session {
    user: AuthUser & { id: string };
  }
  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
  }
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  trustHost: true,
  debug: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: appConfig.auth.signin.href,
    newUser: appConfig.auth.onboarding.href,
    verifyRequest: appConfig.auth.verification.href,
    error: appConfig.auth.error.href,
    signOut: appConfig.auth.signout.href,
  },
  events: {
    linkAccount: async ({ user }) => {
      if (!user.id) return;
      await auth_db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id));
    },
  },
  providers: [
    Resend({ from: env.EMAIL_FROM }),
    Credentials({
      authorize: async (credentials) => {
        try {
          const user = await authWithCredentials(credentials);
          return user;
        } catch (error) {
          // console.log({ error });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.role = user.role;
      if (!user && token.sub) {
        const u = await getUserById(token.sub);
        if (u) {
          token.role = u.role;
          token.picture = u.image;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      session.user.role = token.role;
      session.user.image = token.picture;
      return session;
    },
  },
  adapter: DrizzleAdapter(auth_db) as Adapter,
  secret: env.AUTH_SECRET,
});
