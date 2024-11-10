"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";
import type { ItemInfo } from "@/types";
import { redirect } from "next/navigation";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  stripeUrl?: string;
};

/**
 * https://github.com/javayhu/lms-studio-antonio/blob/main/app/api/courses/%5BcourseId%5D/checkout/route.ts
 */
export async function createCheckoutSession(
  itemId: string,
  priceId: string,
): Promise<ServerActionResponse> {
  let redirectUrl = "";

  try {
    const user = await currentUser();
    if (!user || !user.email || !user.id) {
      return { status: "error", message: "Unauthorized" };
    }

    const item = await sanityFetch<ItemInfo>({
      query: itemByIdQuery,
      params: { id: itemId },
    });
    if (!item) {
      return { status: "error", message: "Item not found!" };
    }

    // 1. get user's stripeCustomerId
    const sanityUser = await getUserById(user.id);
    if (item.submitter._id !== user.id) {
      return { status: "error", message: "You are not allowed to do this!" };
    }
    let stripeCustomerId = sanityUser?.stripeCustomerId;
    // console.log('stripeCustomerId:', stripeCustomerId);

    // 2. if the item is paid and the submitter is the user, then redirect to the billing portal
    if (stripeCustomerId && item.paid) {
      console.log("item is paid, redirect to billing portal");
      const billingUrl = absoluteUrl("/dashboard");
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: billingUrl,
      });
      redirectUrl = stripeSession.url as string;
      // console.log('stripe billing portal session created, url:', redirectUrl);
    } else {
      // 3. make sure the user has a stripeCustomerId
      console.log("item is not paid, redirect to stripe checkout session");
      if (!stripeCustomerId) {
        console.log("creating customer in Stripe and Sanity");
        const customer = await stripe.customers.create({
          email: user.email,
        });
        if (!customer) {
          return {
            status: "error",
            message: "Failed to create customer in Stripe",
          };
        }

        const result = await sanityClient
          .patch(user.id)
          .set({
            stripeCustomerId: customer.id,
          })
          .commit();
        if (!result) {
          return {
            status: "error",
            message: "Failed to save customer in Sanity",
          };
        }
        stripeCustomerId = customer.id;
      }

      // 4. create stripe checkout session
      console.log(
        "Creating Stripe checkout session:",
        {
          customerId: stripeCustomerId,
          priceId,
          userId: user.id,
          itemId,
        }
      );
      // TODO: optimize the success and cancel urls with sessionId!!!
      const successUrl = absoluteUrl(`/publish/${itemId}?pay=success`);
      const cancelUrl = absoluteUrl(`/payment/${itemId}?pay=failed`);
      const stripeSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "payment",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          itemId: itemId,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        payment_method_types: ["card"],
        billing_address_collection: "auto",
      });

      redirectUrl = stripeSession.url as string;
      console.log("stripe checkout session created, url:", redirectUrl);
    }
  } catch (error) {
    return {
      status: "error",
      message: "Failed to generate stripe checkout session",
    };
  }

  // 5. redirect to new url, no revalidatePath because redirect
  redirect(redirectUrl);
}
