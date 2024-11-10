import type { UserRole } from "@/types/user-role";
import NextAuth, { type DefaultSession } from "next-auth";

// https://authjs.dev/getting-started/typescript#module-augmentation
export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isOAuth: boolean;
  link: string;
};

// extend session.user to include role and isOAuth
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
