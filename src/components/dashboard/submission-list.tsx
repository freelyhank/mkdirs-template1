import { SUBMISSIONS_PER_PAGE } from "@/lib/constants";
import type { ItemInfo } from "@/types";
import SubmissionCard, { SubmissionCardSkeleton } from "./submission-card";

interface SubmissionListProps {
  items: ItemInfo[];
}

export default function SubmissionList({ items }: SubmissionListProps) {
  return (
    <div>
      {items && items.length > 0 && (
        <div className="gap-8 grid grid-cols-1">
          {items.map((item) => (
            <SubmissionCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SubmissionListSkeleton({
  count = SUBMISSIONS_PER_PAGE,
}: { count?: number }) {
  return (
    <div className="gap-8 grid grid-cols-1">
      {Array.from({ length: count }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <SubmissionCardSkeleton key={index} />
      ))}
    </div>
  );
}
