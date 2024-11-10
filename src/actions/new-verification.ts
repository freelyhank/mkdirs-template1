"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { sanityClient } from "@/sanity/lib/client";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function newVerification(
  token: string,
): Promise<ServerActionResponse> {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { status: "error", message: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { status: "error", message: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);
  if (!existingUser) {
    return { status: "error", message: "Email does not exist!" };
  }

  await sanityClient
    .patch(existingUser._id)
    .set({
      emailVerified: new Date().toISOString(),
      email: existingToken.identifier,
    })
    .commit();
  console.log("Email verified:", existingUser.email);

  await sanityClient.delete(existingToken._id);
  return { status: "success", message: "Email verified!" };
}
