import Container from "@/components/container";
import { SORT_FILTER_LIST } from "@/lib/constants";
import type { TagListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { tagListQuery } from "@/sanity/lib/queries";
import { SortListDesktop } from "../shared/sort-list-desktop";
import { SortListMobile } from "../shared/sort-list-mobile";
import { TagListDesktop } from "./tag-list-desktop";
import { TagListMobile } from "./tag-list-mobile";

export async function TagFilter() {
  const tagList = await sanityFetch<TagListQueryResult>({
    query: tagListQuery,
  });

  return (
    <div>
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <div className="flex items-center justify-between gap-8">
          <TagListDesktop tagList={tagList} />

          {/* pb-4 is for align ScrollBar in TagListDesktop */}
          <div className="pb-4">
            <SortListDesktop sortList={SORT_FILTER_LIST} />
          </div>
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col gap-8">
        <TagListMobile tagList={tagList} />

        <div className="pb-4">
          <SortListMobile sortList={SORT_FILTER_LIST} />
        </div>
      </div>
    </div>
  );
}
