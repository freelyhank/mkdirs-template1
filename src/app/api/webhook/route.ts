import { getOrderByUserIdAndItemId } from "@/data/order";
import { getUserById } from "@/data/user";
import { sendPaymentSuccessEmail } from "@/lib/mail";
import { stripe } from "@/lib/stripe";
import { PricePlans, ProPlanStatus } from "@/lib/submission";
import { getItemLinkInWebsite } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { headers } from "next/headers";
import type Stripe from "stripe";

/**
 * Stripe webhook handler
 * This file handles webhook events from Stripe. It verifies the signature
 * of each request to ensure that the request is coming from Stripe. It also
 * handles the checkout.session.completed event type by creating a new purchase record in the database.
 *
 * https://github.com/mickasmt/next-saas-stripe-starter/blob/main/app/api/webhooks/stripe/route.ts
 * https://github.com/javayhu/lms-studio-antonio/blob/main/app/api/webhook/route.ts
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // console.log('stripe webhook event:', event);
  console.log("stripe webhook event.type:", event.type);

  if (event.type === "checkout.session.completed") {
    console.log("checkout.session.completed event");
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session?.metadata?.userId;
    const itemId = session?.metadata?.itemId;
    // console.log('session:', session);
    console.log(
      `checkout.session.completed, userId: ${userId}, itemId: ${itemId}`,
    );

    // check if order already exists, if so, return
    const order = await getOrderByUserIdAndItemId(userId, itemId);
    if (order) {
      console.log(
        `checkout.session.completed, order already exists: ${order._id}`,
      );
      return new Response(null, { status: 200 });
    }

    const user = await getUserById(session?.metadata?.userId);
    // console.log('user:', user);

    if (user) {
      const result = await sanityClient.create({
        _type: "order",
        user: {
          _type: "reference",
          _ref: user._id,
        },
        item: {
          _type: "reference",
          _ref: itemId,
        },
        status: "success",
        date: new Date().toISOString(),
      });

      if (!result) {
        console.log("checkout.session.completed, create order failed");
        return new Response(null, { status: 500 });
      }

      // update order & status of item
      const res = await sanityClient
        .patch(itemId)
        .set({
          paid: true,
          featured: true,
          pricePlan: PricePlans.PRO,
          proPlanStatus: ProPlanStatus.SUCCESS,
          order: {
            _type: "reference",
            _ref: result._id,
          },
        })
        .commit();

      if (!res) {
        console.log("checkout.session.completed, update item failed");
        return new Response(null, { status: 500 });
      }

      // send thank you email to user
      console.log(`checkout.session.completed, item: ${JSON.stringify(res)}`);
      const itemLink = getItemLinkInWebsite(res.slug.current);
      console.log(`checkout.session.completed, userName: ${user.name}, 
        userEmail: ${user.email}, 
        itemLink: ${itemLink}`);
      await sendPaymentSuccessEmail(user.name, user.email, itemLink);
    } else {
      console.log("checkout.session.completed, user not found");
      return new Response(null, { status: 404 });
    }
  }

  return new Response(null, { status: 200 });
}
