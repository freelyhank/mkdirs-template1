import { format, parseISO } from "date-fns";
import { defineField } from "sanity";

const order = {
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "item",
      title: "Item",
      type: "reference",
      to: [{ type: "item" }],
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["success", "failed"],
        layout: "radio",
        direction: "horizontal",
      },
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "date",
      title: "Date",
      description: "The date when the order is created",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      name: "item.name",
      media: "item.image",
      date: "_createdAt",
      status: "status",
    },
    prepare({ name, media, date, status }) {
      let title: string;
      if (status === "success") {
        title = `✅ ${name}`;
      } else {
        title = `❌ ${name}`;
      }
      const subtitle = format(parseISO(date), "yyyy/MM/dd");
      return {
        title,
        media,
        subtitle,
      };
    },
  },
};

export default order;
