import account from "./documents/auth/account";
import passwordResetToken from "./documents/auth/password-reset-token";
import user from "./documents/auth/user";
import verificationToken from "./documents/auth/verification-token";
import blockContent from "./documents/block-content";
import blogCategory from "./documents/blog/blog-category";
import blogPost from "./documents/blog/blog-post";
import category from "./documents/directory/category";
import item from "./documents/directory/item";
import tag from "./documents/directory/tag";
import order from "./documents/order/order";
import page from "./documents/page/page";
import settings from "./documents/settings";

export const schemaTypes = [
  // directory
  item,
  tag,
  category,

  // blog
  blogPost,
  blogCategory,

  // page
  page,

  // auth
  user,
  account,
  verificationToken,
  passwordResetToken,

  // order
  order,

  // others
  settings,
  blockContent,
];
