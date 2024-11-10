import { SubmitForm } from "@/components/submit/submit-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import type {
  CategoryListQueryResult,
  TagListQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, tagListQuery } from "@/sanity/lib/queries";

export const metadata = constructMetadata({
  title: "Submit your product (1/3)",
  description: "Submit your product (1/3) – Enter product details",
  canonicalUrl: `${siteConfig.url}/submit`,
});

export default async function SubmitPage() {
  const [categoryList, tagList] = await Promise.all([
    sanityFetch<CategoryListQueryResult>({
      query: categoryListQuery,
    }),
    sanityFetch<TagListQueryResult>({
      query: tagListQuery,
    }),
  ]);

  return <SubmitForm tagList={tagList} categoryList={categoryList} />;
}
