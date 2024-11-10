import ItemCard from "@/components/item/item-card";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { ItemListQueryResult } from "@/sanity.types";
import { Skeleton } from "../ui/skeleton";

interface ItemGridProps {
  items: ItemListQueryResult;
}

export default function ItemGrid({ items }: ItemGridProps) {
  return (
    <div>
      {items && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ItemGridSkeleton({
  count = ITEMS_PER_PAGE,
}: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="w-full aspect-[16/9]" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}
