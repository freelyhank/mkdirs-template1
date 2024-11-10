"use server";

import { resend } from "@/lib/mail";
import { type NewsletterFormData, NewsletterFormSchema } from "@/lib/schemas";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function unsubscribeToNewsletter(
  formdata: NewsletterFormData,
): Promise<ServerActionResponse> {
  try {
    const validatedInput = NewsletterFormSchema.safeParse(formdata);
    if (!validatedInput.success) {
      return { status: "error", message: "Invalid input" };
    }

    const unsubscribedResult = await resend.contacts.remove({
      email: validatedInput.data.email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });
    console.log(
      "unsubscribeToNewsletter, unsubscribedResult",
      unsubscribedResult,
    );
    const unsubscribed = !unsubscribedResult.error;
    if (unsubscribed) {
      return {
        status: "success",
        message: "You have been unsubscribed from the newsletter",
      };
    }

    return {
      status: "error",
      message: "Failed to unsubscribe to the newsletter",
    };
  } catch (error) {
    console.error("unsubscribeToNewsletter, error", error);
    return {
      status: "error",
      message: "Failed to unsubscribe to the newsletter",
    };
  }
}
