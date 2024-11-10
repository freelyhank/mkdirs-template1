"use client";

import { DEFAULT_SORT, type SortFilterItem } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { ListChecksIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import FilterItemMobile from "./filter-item-mobile";

export type SortListMobileProps = {
  sortList: SortFilterItem[];
};

export function SortListMobile({ sortList }: SortListMobileProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  const closeDrawer = () => setOpen(false);

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

  return (
    <div>
      {/* Mobile View */}
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="flex items-center w-full p-3 gap-x-2 border-y text-foreground/90"
        >
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2">
              <ListChecksIcon className="size-5" />
              <span className="text-sm">Sort</span>
            </div>
            <span className="text-sm">
              {sortList.find((item) => item.slug === active)?.label ||
                DEFAULT_SORT.label}
            </span>
          </div>
        </Drawer.Trigger>
        <Drawer.Overlay
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={closeDrawer}
        />
        <Drawer.Portal>
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>

            <ul className="w-full mb-14 p-3 text-muted-foreground">
              {sortList.map((item) => (
                <FilterItemMobile
                  key={item.slug}
                  title={item.label}
                  href={generateUrl(item.slug)}
                  active={active === item.slug}
                  clickAction={closeDrawer}
                />
              ))}
            </ul>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
