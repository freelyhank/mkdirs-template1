import { siteConfig } from "@/config/site";
import { type ClassValue, clsx } from "clsx";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { slugify as transliterateSlugify } from "transliteration";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * slugify with transliteration
 */
export function slugify(str: string): string {
  const transliterated = transliterateSlugify(str);
  return transliterated
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and dashes)
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with a single dash
    .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
    .slice(0, 100);
}

/**
 * get locale date string, like "2024/10/01"
 */
export function getLocaleDate(input: string | number): string {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
}

/**
 * format long date, like "June 1, 2024"
 */
export function formatLongDate(date: string | number): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * build url for search or filter list item
 */
export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  return `${pathname}${queryString}`;
};

/**
 * get absolute url
 */
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

/**
 * get item link in Sanity Studio
 *
 * NOTICE: change this link if the item page in Sanity Studio is changed
 */
export function getItemLinkInStudio(slug: string) {
  return `${siteConfig.url}/studio/structure/itemManagement;item;${slug}`;
}

/**
 * get item link in Website
 *
 * NOTICE: change this link if the item page in Website is changed
 */
export function getItemLinkInWebsite(slug: string) {
  return `${siteConfig.url}/item/${slug}`;
}

/**
 * get item link in Website
 *
 * NOTICE: change this link if the item page in Website is changed
 */
export function getItemStatusLinkInWebsite(id: string) {
  return `${siteConfig.url}/payment/${id}`;
}

///////////////// methods below are not used in the app //////////////////

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export function nl2br(str?: string) {
  if (!str) return "";
  return str.split("\n").join("<br>");
}
