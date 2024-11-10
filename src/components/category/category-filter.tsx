import Container from "@/components/container";
import { SORT_FILTER_LIST } from "@/lib/constants";
import type { CategoryListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery } from "@/sanity/lib/queries";
import { SortListDesktop } from "../shared/sort-list-desktop";
import { SortListMobile } from "../shared/sort-list-mobile";
import { CategoryListDesktop } from "./category-list-desktop";
import { CategoryListMobile } from "./category-list-mobile";

export async function CategoryFilter() {
  const categoryList = await sanityFetch<CategoryListQueryResult>({
    query: categoryListQuery,
  });

  return (
    <div>
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <div className="flex items-center justify-between gap-8">
          <CategoryListDesktop categoryList={categoryList} />

          {/* pb-4 is for align ScrollBar in CategoryListDesktop */}
          <div className="pb-4">
            <SortListDesktop sortList={SORT_FILTER_LIST} />
          </div>
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col gap-8">
        <CategoryListMobile categoryList={categoryList} />

        <div className="pb-4">
          <SortListMobile sortList={SORT_FILTER_LIST} />
        </div>
      </div>
    </div>
  );
}
