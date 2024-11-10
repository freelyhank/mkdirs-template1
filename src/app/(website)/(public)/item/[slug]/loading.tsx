import Container from "@/components/container";
import { ItemGridSkeleton } from "@/components/item/item-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="lg:col-span-3 gap-8 flex flex-col">
          {/* Basic information */}
          <Skeleton className="h-8 w-1/2" />

          {/* name and description */}
          <div className="w-full flex flex-1 items-center">
            <div className="w-full flex flex-col gap-8">
              <Skeleton className="h-12 w-1/4" />
              <Skeleton className="h-24 w-3/4" />
            </div>
          </div>

          {/* action buttons */}
          {/* <div className="flex gap-4">
              <Button size="lg" variant="default" disabled>
                Visit Website
              </Button>
            </div> */}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          {/* image */}
          <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Detailed content */}
          <div className="bg-muted/50 rounded-lg p-6 mr-0 lg:mr-8">
            {/* <h2 className="text-lg font-semibold mb-4">
                Introduction
              </h2> */}
            <Skeleton className="h-80 w-full" />
          </div>

          <div className="flex items-center justify-start mt-16">
            {/* <Button variant="outline" disabled>Back</Button> */}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-4">
              {/* information */}
              <div className="bg-muted/50 rounded-lg p-6">
                {/* <h2 className="text-lg font-semibold mb-4">
                    Information
                  </h2> */}
                <ul className="space-y-4 text-sm">
                  {[...Array(2)].map((_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <li key={index} className="flex justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-32" />
                    </li>
                  ))}
                </ul>
              </div>

              {/* categories */}
              <div className="bg-muted/50 rounded-lg p-6">
                {/* <h2 className="text-lg font-semibold mb-4">
                    Categories
                  </h2> */}
                <div className="flex flex-wrap gap-4">
                  {[...Array(3)].map((_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <Skeleton key={index} className="h-6 w-20" />
                  ))}
                </div>
              </div>

              {/* tags */}
              <div className="bg-muted/50 rounded-lg p-6">
                {/* <h2 className="text-lg font-semibold mb-4">
                    Tags
                  </h2> */}
                <div className="flex flex-wrap gap-4">
                  {[...Array(5)].map((_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <Skeleton key={index} className="h-6 w-16" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section shows related items */}
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-6" />
          <Skeleton className="h-8 w-48" />
          {/* <h2 className="text-lg font-semibold">
              More Related
            </h2> */}
        </div>

        <div className="mt-4">
          <ItemGridSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}
