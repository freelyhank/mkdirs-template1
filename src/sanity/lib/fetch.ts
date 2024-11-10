import { sanityClient } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";
import type { ClientPerspective, QueryParams } from "next-sanity";
import { draftMode } from "next/headers";

/**
 * https://www.sanity.io/plugins/next-sanity
 *
 * Used to fetch data in Server Components, it has built in support for handling Draft Mode and perspectives.
 * When using the "published" perspective then time-based revalidation is used,
 * set to match the time-to-live on Sanity's API CDN (60 seconds)
 * and will also fetch from the CDN.
 * When using the "previewDrafts" perspective then the data is fetched from the live API and isn't cached,
 * it will also fetch draft content that isn't published yet.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  perspective = process.env.NODE_ENV === "development" || draftMode().isEnabled
    ? "previewDrafts"
    : "published",
  disableCache,
}: {
  query: string;
  params?: QueryParams;
  perspective?: Omit<ClientPerspective, "raw">;
  disableCache?: boolean;
}) {
  // console.log('sanityFetch, perspective', perspective, 'query', query);
  if (perspective === "previewDrafts") {
    return sanityClient.fetch<QueryResponse>(query, params, {
      perspective: "previewDrafts",
      // The token is required to fetch draft content
      token,
      // The `previewDrafts` perspective isn't available on the API CDN
      useCdn: false,
      // And we can't cache the responses as it would slow down the live preview experience
      next: { revalidate: 0 },
    });
  }
  return sanityClient.fetch<QueryResponse>(query, params, {
    perspective: "published",
    // The `published` perspective is available on the API CDN
    useCdn: !disableCache,
    // When using the `published` perspective we use time-based revalidation
    // to match the time-to-live on Sanity's API CDN (60 seconds)
    next: { revalidate: disableCache ? 0 : 60 },
  });
}
