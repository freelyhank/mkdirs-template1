import { sanityClient } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * 1. Draft Mode
 * https://www.sanity.io/docs/draft-mode
 * During runtime, switch between an optimized production mode and
 * an authorized mode to fetch draft content and render edit overlays.
 *
 * 2. Presentation Tool
 * https://www.sanity.io/docs/configuring-the-presentation-tool
 * This file is used to allow Presentation to set the app in Draft Mode, which will load Visual Editing
 * and query draft content and preview the content as it will appear once everything is published
 *
 * 3. Preview URL Secret
 * https://www.sanity.io/docs/preview-url-secret#nextjs-app-router
 */
const clientWithToken = sanityClient.withConfig({ token });

export async function GET(request: Request) {
  const { isValid, redirectTo = "/" } = await validatePreviewUrl(
    clientWithToken,
    request.url,
  );
  if (!isValid) {
    return new Response("invalid secret", { status: 401 });
  }

  draftMode().enable();

  redirect(redirectTo);
}
