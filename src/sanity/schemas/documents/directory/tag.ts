import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "tag",
  title: "Tag",
  type: "document",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "name",
      date: "_createdAt",
    },
    prepare({ title, date }) {
      const subtitle = format(parseISO(date), "yyyy/MM/dd");
      return {
        title,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "name",
      name: "name",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
