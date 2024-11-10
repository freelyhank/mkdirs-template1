"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import type { UserPasswordData } from "@/lib/schemas";
import { sanityClient } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function updateUserPassword(
  values: UserPasswordData,
): Promise<ServerActionResponse> {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { status: "error", message: "User not found" };
    }

    // password change needs verification
    if (values.password && values.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        dbUser.password,
      );

      if (!passwordsMatch) {
        return { status: "error", message: "Incorrect password!" };
      }

      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      const updatedUser = await sanityClient
        .patch(dbUser._id)
        .set({
          password: hashedPassword,
        })
        .commit();
      console.log("updateUserPassword, user:", updatedUser);

      revalidatePath("/settings");
      return { status: "success", message: "User password updated!" };
    }
    return { status: "error", message: "No password provided" };
  } catch (error) {
    console.log("updateUserPassword, error", error);
    return {
      status: "error",
      message: "Failed to update user password!",
    };
  }
}
