import { SHOW_QUERY_LOGS } from "@/lib/constants";
import type { PasswordResetToken } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    // @sanity-typegen-ignore
    const passResetTokenQry = `*[_type == "passwordResetToken" && identifier == "${email}"][0]`;
    const passResetToken = await sanityFetch<PasswordResetToken>({
      query: passResetTokenQry,
      disableCache: true,
    });
    if (SHOW_QUERY_LOGS) {
      console.log(
        "getPasswordResetTokenByEmail, passResetToken:",
        passResetToken,
      );
    }
    return passResetToken;
  } catch (error) {
    console.error("getPasswordResetTokenByEmail, error:", error);
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    // @sanity-typegen-ignore
    const passResetTokenQry = `*[_type == "passwordResetToken" && token == "${token}"][0]`;
    const passResetToken = await sanityFetch<PasswordResetToken>({
      query: passResetTokenQry,
      disableCache: true,
    });
    if (SHOW_QUERY_LOGS) {
      console.log(
        "getPasswordResetTokenByToken, passResetToken:",
        passResetToken,
      );
    }
    return passResetToken;
  } catch (error) {
    console.error("getPasswordResetTokenByToken, error:", error);
    return null;
  }
};
