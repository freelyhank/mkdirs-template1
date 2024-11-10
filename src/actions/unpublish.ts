"use server";

import { getItemById } from "@/data/item";
import { currentUser } from "@/lib/auth";
import { sanityClient } from "@/sanity/lib/client";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function unpublish(itemId: string): Promise<ServerActionResponse> {
  console.log("unpublish, itemId:", itemId);
  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }
    // console.log("publish, user:", user);

    const item = await getItemById(itemId);
    if (!item) {
      return { status: "error", message: "Item not found!" };
    }
    if (item.submitter._ref !== user.id) {
      return { status: "error", message: "You are not allowed to do this!" };
    }

    const result = await sanityClient
      .patch(itemId)
      .set({
        publishDate: null,
      })
      .commit();
    // console.log('unpublish, result:', result);

    if (!result) {
      return { status: "error", message: "Failed to unpublish item!" };
    }

    return { status: "success", message: "Item unpublished!" };
  } catch (error) {
    console.log("unpublish, error", error);
    return { status: "error", message: "Failed to unpublish item!" };
  }
}
