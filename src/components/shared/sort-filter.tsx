"use client";

import { SortListDesktop } from "@/components/shared/sort-list-desktop";
import { SortListMobile } from "@/components/shared/sort-list-mobile";
import type { SortFilterItem } from "@/lib/constants";

export type SortFilterProps = {
  sortList: SortFilterItem[];
};

export function SortFilter({ sortList }: SortFilterProps) {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden md:block">
        <SortListDesktop sortList={sortList} />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <SortListMobile sortList={sortList} />
      </div>
    </div>
  );
}
