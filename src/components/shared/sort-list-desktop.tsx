"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_SORT, type SortFilterItem } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type SortListProps = {
  sortList: SortFilterItem[];
};

export function SortListDesktop({ sortList }: SortListProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const activeItem = sortList.find(
      (item) => searchParams.get("sort") === item.slug,
    );
    if (activeItem) {
      setActive(activeItem.slug);
    }
  }, [pathname, sortList, searchParams]);

  const generateUrl = (slug: string) => {
    const q = searchParams.get("q");
    return createUrl(
      pathname,
      new URLSearchParams({
        ...(q && { q }),
        ...(slug && { sort: slug }),
      }),
    );
  };

  const onSelectChange = (value: string) => {
    setActive(value);
    const href = generateUrl(value);
    router.push(href);
  };

  return (
    <Select onValueChange={onSelectChange} value={active}>
      <SelectTrigger className="w-[220px] h-8 text-sm">
        <SelectValue placeholder={DEFAULT_SORT.label} />
      </SelectTrigger>
      <SelectContent className="text-sm">
        {sortList.map((item) => (
          <SelectItem
            key={item.slug}
            value={item.slug}
            className="cursor-pointer"
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
