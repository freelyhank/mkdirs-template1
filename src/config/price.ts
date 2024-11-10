import type { PriceConfig } from "@/types";

export const priceConfig: PriceConfig = {
  plans: [
    {
      title: "Free",
      description: "For Beginners",
      benefits: [
        "Get 3 dofollow links to boost your SEO",
        "Permanent link with backlink maintenance",
        "Reviewed and listed within 72 hours",
        "Publish your product the day you want",
      ],
      limitations: [
        "Backlink to our site is required",
        "No customer support",
      ],
      price: 0,
      stripePriceId: null,
    },
    {
      title: "Pro",
      description: "For Pro Users",
      benefits: [
        "Get at least 3 dofollow links to boost your SEO",
        "Listed immediately, publish it whenever you want",
        "Permanent link, no backlink required",
        "Featured in listings with an award icon",
        "Share through social media and newsletters",
        "Premium customer support",
      ],
      limitations: [],
      price: 9.9,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    },
  ],
};
