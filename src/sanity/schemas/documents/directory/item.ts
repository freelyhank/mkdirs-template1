import { format, parseISO } from "date-fns";
import type { SanityImageAssetDocument } from "next-sanity";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "item",
  title: "Item",
  type: "document",
  groups: [
    {
      name: "status",
      title: "Status",
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Mark as Featured",
      type: "boolean",
      initialValue: false,
      description:
        "If the item is featured, it will be displayed in the featured section",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "categories",
      title: "Categories",
      description: "The categories of the item, may have multiple categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "The tags of the item, may have multiple tags",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "tag" }],
        },
      ],
    }),
    defineField({
      name: "submitter",
      title: "Submitter",
      type: "reference",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      description: "The introduction of the item, in markdown format",
      type: "markdown",
      // https://github.com/sanity-io/sanity-plugin-markdown?tab=readme-ov-file#custom-image-urls
      // The function will be invoked whenever an image is pasted
      // or dragged into the markdown editor, after upload completes.
      options: {
        imageUrl: (imageAsset: SanityImageAssetDocument) => {
          return `${imageAsset.url}?w=400&h=400`;
        },
      },
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for SEO and accessiblity",
          initialValue: (_, parent) => {
            return `Image for ${parent?.name || "item"}`;
          },
        },
      ],
    }),
    // publish related fields
    defineField({
      name: "publishDate",
      title: "Publish Date",
      description: "*Required if you want to show the item in the directory",
      type: "datetime",
      group: "status",
      // hidden: ({ parent }) => !parent.published,
    }),
    // price plan related fields
    defineField({
      name: "pricePlan",
      title: "Price Plan",
      description: "The price plan of the item, chosen by the submitter",
      type: "string",
      group: "status",
      initialValue: "free",
      options: {
        list: ["free", "pro"],
        layout: "radio",
        direction: "horizontal",
      },
      readOnly: true,
    }),
    defineField({
      name: "freePlanStatus",
      title: "Free Plan Status",
      description: "The status of the item when the item is in free plan",
      type: "string",
      group: "status",
      initialValue: "submitting",
      options: {
        list: [
          { title: "Submitting", value: "submitting" },
          { title: "Pending (Waiting for review)", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      hidden: ({ parent }) => parent.pricePlan !== "free",
    }),
    defineField({
      name: "proPlanStatus",
      title: "Pro Plan Status",
      description: "The status of the item when the item is in pro plan",
      type: "string",
      group: "status",
      initialValue: "submitting",
      options: {
        list: [
          { title: "Submitting", value: "submitting" },
          { title: "Pending (Waiting for payment)", value: "pending" },
          { title: "Success", value: "success" },
          { title: "Failed", value: "failed" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      hidden: ({ parent }) => parent.pricePlan !== "pro",
    }),
    defineField({
      name: "rejectionReason",
      title: "Rejection Reason",
      description: "The reason for rejecting the item",
      type: "string",
      group: "status",
      hidden: ({ parent }) => parent.freePlanStatus !== "rejected",
      initialValue: "Other reasons",
      options: {
        list: [
          "The item is not good fit for our directory",
          "The image of the item is not in good quality",
          "The information of the item is not clear",
          "The backlink to our site is not provided",
          "Other reasons",
        ],
        layout: "dropdown",
      },
    }),
    // payment related fields
    defineField({
      name: "paid",
      title: "Paid",
      description: "If the item is paid, it means the payment is successful",
      type: "boolean",
      group: "status",
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "The successful payment order of the submission",
      type: "reference",
      group: "status",
      to: [{ type: "order" }],
      hidden: ({ parent }) => !parent.paid,
      // readOnly: true,
    }),
    defineField({
      name: "forceHidden",
      title: "Force Hidden",
      description: "If the item is force hidden, it will not be displayed regardless of the status. It's helpful when you want to hide an item temporarily.",
      type: "boolean",
      group: "status",
      initialValue: false,
    }),
  ],
  // https://www.sanity.io/docs/previews-list-views
  // Configure and customize how documents are displayed
  // within Sanity Studio's document lists.
  preview: {
    select: {
      name: "name",
      media: "image",
      featured: "featured",
      date: "publishDate",
      pricePlan: "pricePlan",
      freePlanStatus: "freePlanStatus",
      proPlanStatus: "proPlanStatus",
    },
    prepare({
      name,
      media,
      featured,
      date,
      pricePlan,
      freePlanStatus,
      proPlanStatus,
    }) {
      const error = freePlanStatus === "rejected" || proPlanStatus === "failed";
      const title = date ? `✅ ${name}` : error ? `❌ ${name}` : `⏳ ${name}`;
      const feature = featured ? "⭐" : "";
      const status = pricePlan === "free" ? freePlanStatus : proPlanStatus;
      // const status = `${freePlanStatus}-${proPlanStatus}`;
      const time = date
        ? `date: ${format(parseISO(date), "yyyy/MM/dd")}`
        : "not published";
      const subtitle = `${feature}${pricePlan.toUpperCase()}: ${status}, ${time}`;
      return {
        title,
        media,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Publish Date (Newest)",
      name: "dateDesc",
      by: [{ field: "publishDate", direction: "desc" }],
    },
    {
      title: "Publish Date (Oldest)",
      name: "dateAsc",
      by: [{ field: "publishDate", direction: "asc" }],
    },
    {
      title: "Name (A-Z)",
      name: "name",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
