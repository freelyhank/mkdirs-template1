"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@/types/user-role";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

/**
 * demostrate how to use currentRole to check user's role,
 * and return different responses according to different roles.
 */
export async function admin(): Promise<ServerActionResponse> {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { status: "success", message: "Allowed Server Action!" };
  }

  return { status: "error", message: "Forbidden Server Action!" };
}
