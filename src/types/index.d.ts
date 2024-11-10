import type { Icons } from "@/components/icons/icons";
import type {
  BlogPostListQueryResult,
  ItemFullInfoBySlugQueryResult,
  ItemListQueryResult,
} from "@/sanity.types";

// Itme
export type ItemInfo = ItemListQueryResult[number];
// ItemFullInfo has more fields (eg. introduction and related items)
export type ItemFullInfo = ItemFullInfoBySlugQueryResult;
// Blog
export type BlogPostInfo = BlogPostListQueryResult[number];

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  keywords: string[];
  author: string;
  url: string;
  image: string;
  mail: string;
  utm: {
    source: string;
    medium: string;
    campaign: string;
  };
  links: {
    github?: string;
    twitter?: string;
    youtube?: string;
  };
};

export type HeroConfig = {
  title: {
    first: string;
    second: string;
  };
  subtitle: string;
  label: {
    text: string;
    icon: keyof typeof Icons;
    href: string;
  };
};

export type MarketingConfig = {
  menus: NavItem[];
};

export type DashboardConfig = {
  menus: NavItem[];
};

export type UserButtonConfig = {
  menus: NavItem[];
};

export type FooterConfig = {
  links: NestedNavItem[];
};

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type NestedNavItem = {
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type PriceConfig = {
  plans: PricePlan[];
};

export type PricePlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  price: number;
  stripePriceId: string | null;
};

export type FAQConfig = {
  items: FAQItem[];
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};
