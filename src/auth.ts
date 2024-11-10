import authConfig from "@/auth.config";
import { getAccountByUserId } from "@/data/account";
import { getUserById } from "@/data/user";
import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { sanityClient } from "@/sanity/lib/client";
import { SanityAdapter } from "@/sanity/sanity-adapter";
import type { UserRole } from "@/types/user-role";
import NextAuth from "next-auth";

/**
 * https://authjs.dev/getting-started/installation#configure
 * providers for authorization, adapters for user data persistence
 *
 * https://github.com/javayhu/nextjs-14-auth-v5-tutorial/blob/main/auth.ts
 */
export const {
  handlers,
  auth,
  signIn,
  signOut,
  //unstable update in Beta version
  unstable_update,
} = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // https://authjs.dev/guides/creating-a-database-adapter
  adapter: SanityAdapter(sanityClient),
  // https://authjs.dev/concepts/session-strategies
  session: { strategy: "jwt" },
  // https://authjs.dev/concepts/callbacks
  callbacks: {
    // https://authjs.dev/concepts/callbacks#signin
    // https://youtu.be/1MTyCvS05V4?t=10341
    signIn: async ({ user, account }) => {
      // console.log('auth callbacks signIn, start, user:', user);
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      // prevent signIn without email verification
      if (!existingUser?.emailVerified) {
        console.log("auth callbacks signIn, user not verified");
        return false;
      }

      // console.log('auth callbacks signIn, end, user:', existingUser);
      return true;
    },

    // https://authjs.dev/concepts/session-strategies#jwt-session
    // https://authjs.dev/reference/nextjs#jwt
    // This callback is called whenever a JSON Web Token is created (i.e. at sign in)
    // or updated (i.e whenever a session is accessed in the client).
    // Anything you return here will be saved in the JWT and forwarded to the session callback.
    jwt: async ({ token }) => {
      if (SHOW_QUERY_LOGS) {
        console.log("auth callbacks jwt, start, token:", token);
      }
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser._id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.link = existingUser.link;
      token.role = existingUser.role;
      if (SHOW_QUERY_LOGS) {
        console.log("auth callbacks jwt, end, token:", token);
      }
      return token;
    },

    // https://github.com/javayhu/nextjs-14-auth-v5-tutorial/blob/main/auth.ts#L68
    // role and isOAuth are added to the token, so we can pass them to the session
    session: async ({ session, token }) => {
      if (SHOW_QUERY_LOGS) {
        console.log("auth callbacks session, start, token:", token);
      }
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // https://github.com/javayhu/nextjs-14-auth-v5-tutorial/blob/main/auth.ts#L59
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (token.link && session.user) {
        session.user.link = token.link as string;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.isOAuth = token.isOAuth as boolean;
      }

      if (SHOW_QUERY_LOGS) {
        console.log("auth callbacks session, end, session:", session);
      }
      return session;
    },
  },
});
