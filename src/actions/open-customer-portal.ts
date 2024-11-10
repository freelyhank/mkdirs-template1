"use server";

import { currentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  stripeUrl?: string;
};

const billingUrl = absoluteUrl("/dashboard");

/**
 * NOTICE: not used in the app yet
 */
export async function openCustomerPortal(
  stripeCustomerId: string,
): Promise<ServerActionResponse> {
  let redirectUrl = "";

  try {
    const user = await currentUser();
    if (!user || !user.email) {
      return { status: "error", message: "Unauthorized" };
    }

    if (stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: billingUrl,
      });

      redirectUrl = stripeSession.url as string;
    }
  } catch (error) {
    return { status: "error", message: "Failed to open customer portal" };
  }

  redirect(redirectUrl);
  // return { status: "success", stripeUrl: redirectUrl };
}
