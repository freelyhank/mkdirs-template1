"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { BlogCategoryListQueryResult } from "@/sanity.types";
import Link from "next/link";
import { useParams } from "next/navigation";

export type BlogCategoryListDesktopProps = {
  categoryList: BlogCategoryListQueryResult;
};

export function BlogCategoryListDesktop({
  categoryList,
}: BlogCategoryListDesktopProps) {
  const { slug } = useParams() as { slug?: string };

  return (
    <div>
      {/* Desktop View */}
      <div className="flex items-center justify-center">
        <ToggleGroup
          size="sm"
          type="single"
          value={slug || "All"}
          aria-label="Toggle blog category"
          className="h-9 overflow-hidden rounded-full border bg-background p-1 *:h-7 *:text-muted-foreground"
        >
          <ToggleGroupItem
            key="All"
            value="All"
            className={cn(
              "rounded-full px-5",
              "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
              "hover:bg-muted hover:text-muted-foreground",
            )}
            aria-label={"Toggle all blog categories"}
          >
            <Link href={"/blog"}>
              <h2>All</h2>
            </Link>
          </ToggleGroupItem>

          {categoryList.map((category) => (
            <ToggleGroupItem
              key={category.slug.current}
              value={category.slug.current}
              className={cn(
                "rounded-full px-5",
                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                "hover:bg-muted hover:text-muted-foreground",
              )}
              aria-label={`Toggle blog category of ${category.name}`}
            >
              <Link href={`/blog/category/${category.slug.current}`}>
                <h2>{category.name}</h2>
              </Link>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
