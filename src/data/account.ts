import { SHOW_QUERY_LOGS } from "@/lib/constants";
import type { Account } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";

export const getAccountByUserId = async (userId: string) => {
  try {
    // @sanity-typegen-ignore
    const accountQry = `*[_type == "account" && userId == "${userId}"][0]`;
    const account = await sanityFetch<Account>({
      query: accountQry,
      disableCache: true,
    });
    if (SHOW_QUERY_LOGS) {
      console.log("getAccountByUserId, account:", account);
    }
    return account;
  } catch (error) {
    console.error("getAccountByUserId, error:", error);
    return null;
  }
};

export const getAccountByProviderAccountId = async (
  providerAccountId: string,
  provider: string,
) => {
  try {
    // @sanity-typegen-ignore
    const accountQry = `*[_type == "account" && providerAccountId == "${providerAccountId}" && provider == "${provider}"][0]`;
    const account = await sanityFetch<Account>({
      query: accountQry,
      disableCache: true,
    });
    if (SHOW_QUERY_LOGS) {
      console.log("getAccountByProviderAccountId, account:", account);
    }
    return account;
  } catch (error) {
    console.error("getAccountByProviderAccountId, error:", error);
    return null;
  }
};
