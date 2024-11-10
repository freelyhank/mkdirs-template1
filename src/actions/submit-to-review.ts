"use server";

import { getItemById } from "@/data/item";
import { currentUser } from "@/lib/auth";
import { sendNotifySubmissionEmail } from "@/lib/mail";
import { FreePlanStatus, PricePlans } from "@/lib/submission";
import { getItemLinkInStudio, getItemStatusLinkInWebsite } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export const submitToReview = async (
  itemId: string,
): Promise<ServerActionResponse> => {
  console.log("submitToReview, itemId:", itemId);
  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }
    // console.log("submitToReview, user:", user);

    const item = await getItemById(itemId);
    if (!item) {
      return { status: "error", message: "Item not found!" };
    }
    if (item.submitter._ref !== user.id) {
      return { status: "error", message: "You are not allowed to do this!" };
    }
    if (
      item.pricePlan !== PricePlans.FREE ||
      item.freePlanStatus !== FreePlanStatus.SUBMITTING
    ) {
      return { status: "error", message: "Item is not in right plan status!" };
    }

    const result = await sanityClient
      .patch(itemId)
      .set({
        pricePlan: PricePlans.FREE,
        freePlanStatus: FreePlanStatus.PENDING,
      })
      .commit();
    // console.log('submitToReview, result:', result);
    if (!result) {
      return { status: "error", message: "Failed to submit item to review!" };
    }

    const statusLink = getItemStatusLinkInWebsite(itemId);
    const reviewLink = getItemLinkInStudio(itemId);
    sendNotifySubmissionEmail(
      user.name,
      user.email,
      result.name,
      statusLink,
      reviewLink,
    );

    return { status: "success", message: "Item submitted to review!" };
  } catch (error) {
    console.log("submitToReview, error", error);
    return { status: "error", message: "Failed to submit item to review!" };
  }
};
