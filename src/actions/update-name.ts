"use server";

import { unstable_update } from "@/auth";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { type UserNameData, UserNameSchema } from "@/lib/schemas";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function updateUserName(
  values: UserNameData,
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

    // console.log('updateUserName, values:', values);
    const { name } = UserNameSchema.parse(values);

    const updatedUser = await sanityClient
      .patch(dbUser._id)
      .set({
        name: name,
      })
      .commit();
    // console.log("updateUserName, user:", updatedUser);

    // unstable update in Beta version
    unstable_update({
      user: {
        name: updatedUser.name,
      },
    });

    revalidatePath("/settings");
    return { status: "success", message: "User name updated!" };
  } catch (error) {
    console.log("updateUserName, error", error);
    return {
      status: "error",
      message: "Failed to update user name!",
    };
  }
}
