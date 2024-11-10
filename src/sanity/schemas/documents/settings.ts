import { defineField, defineType } from "sanity";

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  description: "Settings for the website, not used for now",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
  ],
});
