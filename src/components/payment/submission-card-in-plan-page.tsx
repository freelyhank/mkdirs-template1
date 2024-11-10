"use client";

import SubmissionStatus from "@/components/dashboard/submission-status";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocaleDate } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import SubmissionCardImage from "../dashboard/submission-card-image";

type SubmissionCardInPlanPageProps = {
  item: ItemInfo;
};

export default function SubmissionCardInPlanPage({
  item,
}: SubmissionCardInPlanPageProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 w-full">
      {/* Left column */}
      <div className="md:col-span-2 flex flex-col">
        <SubmissionCardImage item={item} />
      </div>

      {/* Right column */}
      <div className="md:col-span-3 flex flex-col justify-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-medium">{item.name}</h1>

          <p className="text-muted-foreground line-clamp-2 text-balance leading-relaxed">
            {item.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Plan:</span>
              <span className="capitalize">{item.pricePlan}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <SubmissionStatus item={item} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Publish Date:</span>
              {item.publishDate ? (
                <span className="font-medium">
                  {getLocaleDate(item.publishDate)}
                </span>
              ) : (
                <span className="font-semibold">Not published</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Created Date:</span>
              <span className="">{getLocaleDate(item._createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubmissionCardInPlanPageSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 w-full">
      {/* Left column */}
      <div className="md:col-span-2 flex flex-col">
        <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>

      {/* Right column */}
      <div className="md:col-span-3 flex flex-col justify-between">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" /> {/* Title */}
          <Skeleton className="h-8 w-full" /> {/* Description */}
          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-12" /> {/* Plan label */}
              <Skeleton className="h-8 w-20" /> {/* Plan value */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16" /> {/* Status label */}
              <Skeleton className="h-8 w-24" /> {/* Status value */}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" /> {/* Publish Date label */}
              <Skeleton className="h-8 w-32" /> {/* Publish Date value */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" /> {/* Created Date label */}
              <Skeleton className="h-8 w-32" /> {/* Created Date value */}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  );
}
