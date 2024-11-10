"use server";

import { unstable_update } from "@/auth";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import type { SettingsSchema } from "@/lib/schemas";
import { sanityClient } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import type * as z from "zod";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function settings(
  values: z.infer<typeof SettingsSchema>,
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

    // console.log('settings, values:', values);
    if (user.isOAuth) {
      values.password = undefined;
      values.newPassword = undefined;
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
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    const updatedUser = await sanityClient
      .patch(dbUser._id)
      .set({
        ...values,
      })
      .commit();
    console.log("settings, updatedUser:", updatedUser);

    // unstable update in Beta version
    unstable_update({
      user: {
        name: updatedUser.name,
        link: updatedUser.link,
      },
    });

    revalidatePath("/settings");
    return { status: "success", message: "Account information updated!" };
  } catch (error) {
    console.log("settings, error", error);
    return {
      status: "error",
      message: "Failed to update account information!",
    };
  }
}
