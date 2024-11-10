import type { FAQConfig } from "@/types";
import { siteConfig } from "./site";

export const faqConfig: FAQConfig = {
  items: [
  {
    id: "item-1",
    question: "Is it free to submit my product?",
    answer:
      "Yes, it is. \nYou can submit your product for free to get 3 dofollow links to boost your SEO. \nHowever, the free plan has limitations:\n" +
      "• Reviewed and listed within 72 hours\n" +
      "• Requires a backlink to our site\n" +
      "• No customer support",
  },
  {
    id: "item-2",
    question: "What are the benefits of the Pro plan?",
    answer:
      "The Pro plan offers several benefits:\n" +
      "• At least 3 dofollow links\n" +
      "• Immediate listing, or publish it whenever you want\n" +
      "• Permanent links with no backlink requirement\n" +
      "• Featured in listings with an award icon\n" +
      "• Promotion through our social media and newsletters\n" +
      "• Premium customer support",
  },
  {
    id: "item-3",
    question:
      "The differences between Free and Pro plans?",
    answer:
      "Free plan submissions are reviewed and listed within 72 hours, a backlink to our site is required. \nWhile Pro plan submissions are included immediately, no backlink is required. \nBoth plans can be launched whenever you want and update product information anytime.",
  },
  {
    id: "item-4",
    question: "Do I need to provide a backlink for my listing?",
    answer:
      `For the Free plan, a backlink to our site is required. \nThe backlink is <a href='${siteConfig.url}' title='${siteConfig.name}'>${siteConfig.name}</a>. \nHowever, if you choose the Pro plan, you get a permanent link without any backlink requirement.`,
    },
  ],
};
