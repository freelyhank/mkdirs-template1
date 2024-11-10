"use client";

import { PublishNowButton } from "@/components/publish/publish-now-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ItemInfo } from "@/types";
import { CalendarDaysIcon, PartyPopperIcon } from "lucide-react";
import Link from "next/link";
import SubmissionCardImage from "../dashboard/submission-card-image";
import { Card } from "../ui/card";

type SubmissionCardInPublishPageProps = {
  item: ItemInfo;
};

export default function SubmissionCardInPublishPage({
  item,
}: SubmissionCardInPublishPageProps) {
  return (
    <Card className="flex flex-col items-center w-full p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 w-full">
        {/* Left column */}
        <div className="md:col-span-2 flex flex-col">
          <SubmissionCardImage item={item} />
        </div>

        {/* Right column */}
        <div className="md:col-span-3 flex items-center">
          <div className="flex flex-col w-full space-y-8">
            {/* name and description */}
            <h1 className="text-4xl font-medium text-start">{item.name}</h1>
            <p className="text-muted-foreground line-clamp-2 text-balance leading-relaxed">
              {item.description}
            </p>

            {/* action buttons */}
            <div className="pt-4">
              {item.publishDate ? (
                <div className="flex flex-row gap-4">
                  <div className="">
                    <Button
                      size="lg"
                      variant="default"
                      asChild
                      className="group overflow-hidden"
                    >
                      <Link
                        href={`/item/${item.slug.current}`}
                        className="flex items-center justify-center space-x-2"
                      >
                        <PartyPopperIcon className="w-4 h-6 icon-scale" />
                        <span className="">View on site</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-4">
                  <div className="">
                    <PublishNowButton item={item} />
                  </div>

                  <div className="">
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="group overflow-hidden flex-1 w-full"
                    >
                      <Link
                        href="/dashboard"
                        className="flex items-center justify-center space-x-2"
                      >
                        <CalendarDaysIcon className="w-4 h-6 icon-scale" />
                        <span className="">Publish Later</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SubmissionCardInPublishPageSkeleton() {
  return (
    <Card className="flex flex-col items-center w-full p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 w-full">
        {/* Left column - Image skeleton */}
        <div className="md:col-span-2 flex flex-col">
          <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
            <Skeleton className="w-full h-full" />
          </div>
          {/* Category and tag skeletons */}
          <div className="absolute left-2 bottom-2 flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-8 w-14 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-18 rounded-md" />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-3 flex flex-col justify-center">
          <div className="flex flex-col w-full space-y-8">
            {/* Title skeleton */}
            <Skeleton className="h-12 w-1/2" />

            {/* Description skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
            </div>

            {/* Action button skeleton */}
            <div className="pt-4">
              <div className="flex flex-row gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
