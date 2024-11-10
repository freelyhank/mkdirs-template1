import { PricingPlansSkeleton } from "@/components/dashboard/pricing-plans";
import { SubmissionCardInPlanPageSkeleton } from "@/components/payment/submission-card-in-plan-page";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <Card className="flex flex-col items-center">
      <div className="w-full p-4">
        <SubmissionCardInPlanPageSkeleton />
      </div>

      <Separator className="w-full" />

      <div className="w-full p-4 my-4">
        <PricingPlansSkeleton />
      </div>
    </Card>
  );
}
