// TODO: fix token is server-only, otherwise sanity adapter can not create user!!!
import "server-only";

// import { experimental_taintUniqueValue } from "react";

// token is used to fetch data in Server Components,
// can not be used in client components for security reasons
// export const token = process.env.SANITY_API_TOKEN;

// if (!token) {
//   throw new Error("Missing SANITY_API_TOKEN");
// }

export const token = assertValue(
  process.env.SANITY_API_TOKEN,
  // process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  "Missing environment variable: SANITY_API_TOKEN",
);

// experimental_taintUniqueValue(
//   "Do not pass the sanity API read token to the client",
//   process,
//   token,
// );

/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */
function assertValue<T>(value: T | undefined, errorMessage: string): T {
  if (value === undefined) {
    throw new Error(errorMessage);
  }

  return value;
}
