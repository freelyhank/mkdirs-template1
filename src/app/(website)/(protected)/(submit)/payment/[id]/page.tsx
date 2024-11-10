import { PricingPlans } from "@/components/dashboard/pricing-plans";
import SubmissionCardInPlanPage from "@/components/payment/submission-card-in-plan-page";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { currentUser } from "@/lib/auth";
import { constructMetadata } from "@/lib/metadata";
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
    title: "Submit your product (2/3)",
    description: "Submit your product (2/3) Choose pricing plan",
    canonicalUrl: `${siteConfig.url}/payment/${params.id}`,
  });
}

export default async function PlanPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) {
    console.error("PlanPage, user not found");
    return redirect("/auth/login");
  }

  const { id } = params;
  console.log("PlanPage, itemId:", id);
  const item = await sanityFetch<ItemInfo>({
    query: itemByIdQuery,
    params: { id: id },
    disableCache: true,
  });

  if (!item) {
    console.error("PlanPage, item not found");
    return notFound();
  }
  // console.log('PlanPage, item:', item);

  // redirect to dashboard if the item is not submitted by the user
  if (item.submitter._id !== user.id) {
    console.error("PlanPage, user not match");
    return redirect("/dashboard");
  }

  return (
    <Card className="flex flex-col items-center">
      <div className="w-full p-4">
        <SubmissionCardInPlanPage item={item} />
      </div>

      <Separator className="w-full" />

      <div className="w-full max-w-4xl p-4 my-4">
        <PricingPlans item={item} />
      </div>
    </Card>
  );
}
