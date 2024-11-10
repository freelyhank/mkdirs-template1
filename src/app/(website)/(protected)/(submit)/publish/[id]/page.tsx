import SubmissionCardInPublishPage from "@/components/publish/submission-card-in-publish-page";
import ConfettiEffect from "@/components/shared/confetti-effect";
import { siteConfig } from "@/config/site";
import { currentUser } from "@/lib/auth";
import { constructMetadata } from "@/lib/metadata";
import { FreePlanStatus, PricePlans, ProPlanStatus } from "@/lib/submission";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemByIdQuery } from "@/sanity/lib/queries";
import type { ItemInfo } from "@/types";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  return constructMetadata({
    title: "Submit your product (3/3)",
    description: "Submit your product (3/3) Review and publish product",
    canonicalUrl: `${siteConfig.url}/publish/${params.id}`,
  });
}

export default async function PublishPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await currentUser();
  if (!user) {
    console.error("PublishPage, user not found");
    return redirect("/auth/login");
  }

  const { id } = params;
  const { pay } = searchParams as { [key: string]: string };
  const showConfetti = pay === "success";
  // console.log('PublishPage, itemId:', id);
  const item = await sanityFetch<ItemInfo>({
    query: itemByIdQuery,
    params: { id: id },
    disableCache: true,
  });

  if (!item) {
    console.error("PublishPage, item not found");
    return notFound();
  }
  // console.log("PublishPage, item:", item);

  // redirect to dashboard if the item is not submitted by the user
  if (item.submitter._id !== user.id) {
    console.error("PublishPage, user not match");
    return redirect("/dashboard");
  }

  // check status, redirect to the corresponding page if the status is not right
  if (
    item.pricePlan === PricePlans.FREE &&
    item.freePlanStatus !== FreePlanStatus.APPROVED
  ) {
    return redirect("/dashboard");
  }
  if (
    item.pricePlan === PricePlans.PRO &&
    item.proPlanStatus !== ProPlanStatus.SUCCESS
  ) {
    return redirect("/dashboard");
  }

  return (
    <div>
      {/* show confetti if the payment is successful */}
      {showConfetti && <ConfettiEffect />}

      <SubmissionCardInPublishPage item={item} />
    </div>
  );
}
