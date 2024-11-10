import type { FooterConfig } from "@/types";
import { siteConfig } from "./site";

export const footerConfig: FooterConfig = {
  links: [
    {
      title: "Product",
      items: [
        { title: "Landing", href: "/landing" },
        { title: "Search", href: "/search" },
        { title: "Category", href: "/category" },
        { title: "Tag", href: "/tag" },
      ],
    },
    {
      title: "Resources",
      items: [
        { title: "Pricing", href: "/pricing" },
        { title: "Submit", href: "/submit" },
        { title: "Blog", href: "/blog" },
        { title: "Changelog", href: "/changelog" },
      ],
    },
    {
      title: "Support",
      items: [
        { title: "GitHub", href: siteConfig.links.github, external: true },
        { title: "Twitter", href: siteConfig.links.twitter, external: true },
        { title: "Youtube", href: siteConfig.links.youtube, external: true },
        { title: "Email", href: `mailto:${siteConfig.mail}`, external: true },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About Us", href: "/about" },
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
        { title: "Sitemap", href: "/sitemap.xml" },
      ],
    },
  ],
};
