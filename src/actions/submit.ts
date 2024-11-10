"use server";

import { currentUser } from "@/lib/auth";
import { SubmitSchema } from "@/lib/schemas";
import { FreePlanStatus, PricePlans } from "@/lib/submission";
import { slugify } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type SubmitFormData = {
  name: string;
  link: string;
  description: string;
  introduction: string;
  tags: string[];
  categories: string[];
  imageId: string;
};

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  id?: string;
};

/**
 * https://nextjs.org/learn/dashboard-app/mutating-data
 */
export async function submit(
  formData: SubmitFormData,
): Promise<ServerActionResponse> {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }

    // console.log("submit, data:", formData);
    const { name, link, description, introduction, imageId, tags, categories } =
      SubmitSchema.parse(formData);
    console.log("submit, name:", name, "link:", link);

    const slug = slugify(name);
    const data = {
      _type: "item",
      name,
      slug: {
        _type: "slug",
        current: slug,
      },
      link,
      description,
      introduction,
      publishDate: null,

      paid: false,
      pricePlan: PricePlans.FREE,
      freePlanStatus: FreePlanStatus.SUBMITTING,
      submitter: {
        _type: "reference",
        _ref: user.id,
      },

      // The _key only needs to be unique within the array itself
      tags: tags.map((tag, index) => ({
        _type: "reference",
        _ref: tag,
        _key: index.toString(),
      })),
      categories: categories.map((category, index) => ({
        _type: "reference",
        _ref: category,
        _key: index.toString(),
      })),
      image: {
        _type: "image",
        alt: `image of ${name}`,
        asset: {
          _type: "reference",
          _ref: imageId,
        },
      },
    };

    // console.log("submit, data:", data);

    const res = await sanityClient.create(data);
    if (!res) {
      console.log("submit, fail");
      return { status: "error", message: "Failed to submit" };
    }

    // console.log("submit, success, res:", res);

    // Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time.
    // Along with prefetching, this cache ensures that users can quickly navigate between routes
    // while reducing the number of requests made to the server.
    // Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server.
    // You can do this with the revalidatePath function from Next.js.
    revalidatePath("/submit");

    return { status: "success", message: "Successfully created", id: res._id };
  } catch (error) {
    console.log("submit, error", error);
    return { status: "error", message: "Failed to submit" };
  }
}
