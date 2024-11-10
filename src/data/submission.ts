import { SUBMISSIONS_PER_PAGE } from "@/lib/constants";
import type { SubmissionListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { itemSimpleFields } from "@/sanity/lib/queries";

/**
 * get submissions from sanity
 */
export async function getSubmissions({
  userId,
  currentPage,
}: {
  userId?: string;
  currentPage: number;
}) {
  const { countQuery, dataQuery } = buildQuery(userId, currentPage);
  const [totalCount, submissions] = await Promise.all([
    sanityFetch<number>({
      query: countQuery,
      disableCache: true,
    }),
    sanityFetch<SubmissionListQueryResult>({
      query: dataQuery,
      disableCache: true,
    }),
  ]);
  return { submissions, totalCount };
}

/**
 * build count and data query for get submissions from sanity
 */
const buildQuery = (userId: string, currentPage = 1) => {
  const userCondition = `&& submitter._ref == "${userId}"`;
  const offsetStart = (currentPage - 1) * SUBMISSIONS_PER_PAGE;
  const offsetEnd = offsetStart + SUBMISSIONS_PER_PAGE;

  // @sanity-typegen-ignore
  const countQuery = `count(*[_type == "item" && defined(slug.current) 
       ${userCondition} ])`;
  // @sanity-typegen-ignore
  const dataQuery = `*[_type == "item" && defined(slug.current) 
       ${userCondition} ] | order(_createdAt desc) [${offsetStart}...${offsetEnd}] {
        ${itemSimpleFields}
    }`;
  // console.log('buildQuery, countQuery', countQuery);
  // console.log('buildQuery, dataQuery', dataQuery);
  return { countQuery, dataQuery };
};
