"use client";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { ProPlanStatus } from "@/lib/submission";
import { cn } from "@/lib/utils";
import type { ItemInfo, PricePlan } from "@/types";
import {
  ArrowRightIcon,
  ArrowUpLeftIcon,
  CheckCircleIcon,
  RocketIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface ProPlanButtonProps {
  item?: ItemInfo;
  pricePlan: PricePlan;
  className?: string;
}

export function ProPlanButton({
  item,
  pricePlan,
  className,
}: ProPlanButtonProps) {
  // console.log("ProPlanButton, item:", item);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreateCheckoutSession = () => {
    startTransition(async () => {
      createCheckoutSession(item._id, pricePlan.stripePriceId)
        .then((data) => {
          console.log("createCheckoutSession, data:", data);
          // already redirected to stripe checkout page in server action
        })
        .catch((error) => {
          console.error("createCheckoutSession, error:", error);
          toast.error("Failed to create checkout session");
        });
    });
  };

  const handleClick = () => {
    console.log(
      "ProPlanButton, handleClick, item.proPlanStatus:",
      item?.proPlanStatus,
    );
    if (!item) {
      // no specific item in pricing page
      router.push("/submit");
    } else if (
      item.proPlanStatus === null ||
      item.proPlanStatus === ProPlanStatus.SUBMITTING ||
      item.proPlanStatus === ProPlanStatus.PENDING
    ) {
      // maybe in pro plan or free plan before
      console.log("ProPlanButton, handleClick, creating checkout session");
      handleCreateCheckoutSession();
    } else if (item.proPlanStatus === ProPlanStatus.SUCCESS) {
      if (item.publishDate) {
        // already published
        console.log("ProPlanButton, handleClick, already published");
        router.push("/dashboard");
      } else {
        // pay success but not published yet
        console.log(
          "ProPlanButton, handleClick, pay success but not published yet",
        );
        router.push(`/publish/${item._id}`);
      }
    } else if (item.proPlanStatus === ProPlanStatus.FAILED) {
      console.log("ProPlanButton, handleClick, pay failed");
    } else {
      console.error(
        "ProPlanButton, invalid pro plan status:",
        item.proPlanStatus,
      );
    }
  };

  return (
    <Button
      size="lg"
      variant="default"
      className={cn(
        "overflow-hidden rounded-full",
        "group transition-transform duration-300 ease-in-out hover:scale-105",
        "bg-primary text-primary-foreground dark:bg-primary/90",
        "hover:bg-primary/90 dark:hover:bg-primary/80",
        "shadow-lg hover:shadow-xl",
        className,
      )}
      disabled={isPending}
      onClick={handleClick}
    >
      {!item ? (
        <div className="flex items-center justify-center gap-2">
          <span>Go Submit</span>
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      ) : isPending ? (
        // when creating checkout session
        <div className="flex items-center justify-center">
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : item.proPlanStatus === ProPlanStatus.SUCCESS ? (
        // maybe published already(pay success or approved in free plan)
        item.publishDate ? (
          <div className="flex items-center justify-center">
            <ArrowUpLeftIcon className="mr-2 size-4 icon-scale" />
            <span>Go dashboard</span>
          </div>
        ) : (
          // maybe pay success but not published yet
          <div className="flex items-center justify-center">
            <CheckCircleIcon className="mr-2 size-4 icon-scale" />
            <span>Go Publish</span>
          </div>
        )
      ) : (
        // not paid success yet
        <div className="flex items-center justify-center">
          <RocketIcon className="mr-2 size-4 icon-scale" />
          <span>Pay & Publish Right Now</span>
        </div>
      )}
    </Button>
  );
}
