"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { TagListQueryResult } from "@/sanity.types";
import { useParams } from "next/navigation";
import FilterItemDesktop from "../shared/filter-item-desktop";

export type TagListDesktopProps = {
  tagList: TagListQueryResult;
};

export function TagListDesktop({ tagList }: TagListDesktopProps) {
  const { slug } = useParams() as { slug?: string };

  return (
    <ScrollArea className="hidden md:flex w-full pb-4">
      <ul className="w-full flex flex-1 gap-x-2">
        <FilterItemDesktop title="All" href="/tag" active={!slug} />

        {tagList.map((item) => (
          <FilterItemDesktop
            key={item.slug.current}
            title={item.name}
            href={`/tag/${item.slug.current}`}
            active={item.slug.current === slug}
          />
        ))}
      </ul>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
