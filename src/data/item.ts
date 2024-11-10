import { ITEMS_PER_PAGE, SHOW_QUERY_LOGS } from "@/lib/constants";
import type { Item, ItemListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemSimpleFields } from "@/sanity/lib/queries";

/**
 * get item by id
 */
export async function getItemById(id: string) {
  try {
    // @sanity-typegen-ignore
    const itemQry = `*[_type == "item" && _id == "${id}"][0]`;
    const item = await sanityFetch<Item>({
      query: itemQry,
      disableCache: true,
    });
    if (SHOW_QUERY_LOGS) {
      console.log("getItemById, item:", item);
    }
    return item;
  } catch (error) {
    console.error("getItemById, error:", error);
    return null;
  }
}

/**
 * get items from sanity
 */
export async function getItems({
  category,
  tag,
  sortKey,
  reverse,
  query,
  filter,
  currentPage,
}: {
  category?: string;
  tag?: string;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
  filter?: string;
  currentPage: number;
}) {
  console.log("getItems, category", category, "tag", tag, "query", query, "filter", filter, "sortKey", sortKey, "reverse", reverse);
  const { countQuery, dataQuery } = buildQuery(
    category,
    tag,
    sortKey,
    reverse,
    query,
    filter,
    currentPage,
  );
  const [totalCount, items] = await Promise.all([
    sanityFetch<number>({ query: countQuery }),
    sanityFetch<ItemListQueryResult>({ query: dataQuery }),
  ]);
  return { items, totalCount };
}

/**
 * build count and data query for get items from sanity
 */
const buildQuery = (
  category?: string,
  tag?: string,
  sortKey?: string,
  reverse?: boolean,
  query?: string,
  filter?: string,
  currentPage = 1,
) => {
  const orderDirection = reverse ? "desc" : "asc";
  const sortOrder = sortKey
    ? `| order(${sortKey} ${orderDirection})`
    : "| order(publishDate desc)";
  const queryPattern = query ? `*${query}*` : "";
  const queryKeywords = query
    ? `&& (name match "${queryPattern}" 
    || description match "${queryPattern}"
    || introduction match "${queryPattern}")`
    : "";
  const filterCondition = filter ? `&& ${filter}` : "";
  const queryCondition = [queryKeywords, filterCondition]
    .filter(Boolean)
    .join(" ");
  const categoryCondition = category
    ? `&& "${category}" in categories[]->slug.current`
    : "";
  const tagCondition = tag ? `&& "${tag}" in tags[]->slug.current` : "";
  const offsetStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const offsetEnd = offsetStart + ITEMS_PER_PAGE;

  // @sanity-typegen-ignore
  const countQuery = `count(*[_type == "item" && defined(slug.current) 
      && defined(publishDate) && forceHidden != true
      ${queryCondition} ${categoryCondition} ${tagCondition}])`;
  // @sanity-typegen-ignore
  const dataQuery = `*[_type == "item" && defined(slug.current) 
      && defined(publishDate) && forceHidden != true
      ${queryCondition} ${categoryCondition} ${tagCondition}] ${sortOrder} 
      [${offsetStart}...${offsetEnd}] {
      ${itemSimpleFields}
    }`;
  // console.log('buildQuery, countQuery', countQuery);
  // console.log('buildQuery, dataQuery', dataQuery);
  return { countQuery, dataQuery };
};
