import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <CustomPageSkeleton />;
}

function CustomPageSkeleton() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <Skeleton className="h-12 w-32 mb-4" />
        <Skeleton className="h-8 w-2/3 max-w-xl mb-4" />
      </div>
      <Skeleton className="h-px w-full my-4" />
      <article className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />

        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />

        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />

        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </article>
    </div>
  );
}
