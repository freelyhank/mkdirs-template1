"use client";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_QUERY,
  DEFAULT_SORT,
  type QueryFilterItem,
  type SortFilterItem,
} from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_FILTER_VALUE, ResponsiveComboBox } from "../shared/combobox";
import SearchBox from "./search-box";

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
  selectedTag?: string;
  selectedCategory?: string;
  selectedSort?: string;
}

interface TagFilterItem {
  slug: string;
  name: string;
}

interface CategoryFilterItem {
  slug: string;
  name: string;
}

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
}

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
  filterList: QueryFilterItem[];
  urlPrefix: string;
}

export function SearchFilterClient({
  tagList,
  categoryList,
  sortList,
  filterList,
  urlPrefix,
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const selectedTag = searchParams.get("tag");
  const selectedSort = searchParams.get("sort");
  const selectedFilter = searchParams.get("f");
  const handleFilterChange = (type: string, value: string) => {
    console.log(`Filter changed: ${type} -> ${value}`);
    const newParams = new URLSearchParams(window.location.search);
    if (value === null || value === DEFAULT_FILTER_VALUE) {
      newParams.delete(type);
    } else {
      newParams.set(type, value);
    }
    router.push(`${urlPrefix}?${newParams.toString()}`);
  };

  const handleResetFilters = () => {
    router.push(urlPrefix);
  };

  const categoryFilterItemList = [
    { value: DEFAULT_FILTER_VALUE, label: "All Categories" },
    ...categoryList.map((item) => ({
      value: item.slug,
      label: item.name,
    })),
  ];
  const tagFilterItemList = [
    { value: DEFAULT_FILTER_VALUE, label: "All Tags" },
    ...tagList.map((item) => ({
      value: item.slug,
      label: item.name,
    })),
  ];
  // change default sort value to default filter value
  const sortFilterItemList = sortList.map((item) => ({
    value: item.slug ?? DEFAULT_FILTER_VALUE,
    label: item.label,
  }));
  const queryFilterItemList = filterList.map((item) => ({
    value: item.slug ?? DEFAULT_FILTER_VALUE,
    label: item.label,
  }));

  return (
    <div className="grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr_0.5fr] gap-2 z-10 items-center">
      <SearchBox urlPrefix={urlPrefix} />

      <ResponsiveComboBox
        filterItemList={categoryFilterItemList}
        placeholder="All Categories"
        labelPrefix="Category: "
        selectedValue={selectedCategory || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange("category", value)}
      />

      <ResponsiveComboBox
        filterItemList={tagFilterItemList}
        placeholder="All Tags"
        labelPrefix="Tag: "
        selectedValue={selectedTag || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange("tag", value)}
      />

      <ResponsiveComboBox
        filterItemList={queryFilterItemList}
        placeholder={DEFAULT_QUERY.label}
        selectedValue={selectedFilter || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange("f", value)}
      />

      <ResponsiveComboBox
        filterItemList={sortFilterItemList}
        placeholder={DEFAULT_SORT.label}
        selectedValue={selectedSort || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange("sort", value)}
      />

      <Button variant="outline" onClick={handleResetFilters}>
        Reset
      </Button>
    </div>
  );
}
