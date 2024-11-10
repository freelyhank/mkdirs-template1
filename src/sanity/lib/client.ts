import { createClient } from "next-sanity";
import type { SanityClient } from "sanity";
import { apiVersion, dataset, projectId } from "./api";
import { token } from "./token";

/**
 * sanityClient is used to fetch data in Server Components,
 * can not be used in client components for security reasons!
 */
export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  useCdn: process.env.NODE_ENV === "production",
  token,
});
