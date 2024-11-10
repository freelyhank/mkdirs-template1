import { format, parseISO } from "date-fns";
import { defineField } from "sanity";

const account = {
  name: "account",
  title: "Account",
  type: "document",
  fields: [
    defineField({
      name: "userId",
      title: "User Id",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "type",
      title: "Account Type",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "provider",
      title: "Account Provider",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "providerAccountId",
      title: "Account Provider Id",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "refreshToken",
      title: "Refresh Token",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "accessToken",
      title: "Access Token",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "expiresAt",
      title: "Expires At",
      type: "number",
      readOnly: true,
    }),
    defineField({
      name: "tokenType",
      title: "Token Type",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "scope",
      title: "Scope",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "idToken",
      title: "Id Token",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "sessionState",
      title: "Session State",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      id: "userId",
      name: "user.name",
      provider: "provider",
      date: "_createdAt",
    },
    prepare({ id, name, provider, date }) {
      const title = name;
      // get simple user id by concating the first 4 and last 4 characters
      const userid = `${id.substring(5, 9)}...${id.substring(id.length - 4)}`;
      const subtitle = `${format(parseISO(date), "yyyy/MM/dd")}-${provider.toUpperCase()}-${userid}`;
      return {
        title,
        subtitle,
      };
    },
  },
};

export default account;
