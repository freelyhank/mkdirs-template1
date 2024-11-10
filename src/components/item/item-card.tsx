"use client";

import { siteConfig } from "@/config/site";
import { urlForImage } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import { ArrowRightIcon, AwardIcon, HashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ItemCardProps = {
  item: ItemInfo;
};

export default function ItemCard({ item }: ItemCardProps) {
  const imageProps = item?.image ? urlForImage(item.image) : null;
  const imageBlurDataURL = item?.image?.blurDataURL || null;
  // console.log(`ItemCard, imageBlurDataURL:${imageBlurDataURL}`);
  const itemUrlPrefix = "/item";
  const itemLink = `${item.link}?utm_source=${siteConfig.utm.source}&utm_medium=${siteConfig.utm.medium}&utm_campaign=${siteConfig.utm.campaign}`;

  return (
    <div
      className={cn(
        "cursor-pointer border rounded-lg flex flex-col justify-between gap-4",
        "hover:bg-accent/60 transition-colors duration-300",
      )}
    >
      {/* top */}
      <div className="flex flex-col">
        {/* Image container */}
        <div className="group overflow-hidden relative aspect-[16/9] rounded-t-md transition-all border-b">
          {imageProps && (
            <div className="relative w-full h-full">
              <Image
                src={imageProps?.src}
                alt={item.image.alt || `image of ${item.name}`}
                fill
                className="object-cover image-scale"
                {...(imageBlurDataURL && {
                  placeholder: "blur",
                  blurDataURL: imageBlurDataURL,
                })}
              />

              <div className="absolute left-2 bottom-2 opacity-100 transition-opacity duration-300">
                <div className="flex flex-col gap-2">
                  {item.categories && item.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.categories.map((category, index) => (
                        <span
                          key={category._id}
                          className="text-xs font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded-md"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {item.link ? (
            <Link
              href={itemLink}
              prefetch={false}
              target="_blank"
              className="absolute inset-0 flex items-center justify-center bg-black 
                    bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300"
            >
              <span
                className="text-white text-lg font-semibold 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Visit Website
              </span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* center */}
      <Link
        href={`${itemUrlPrefix}/${item.slug.current}`}
        className="flex flex-col gap-4 group"
      >
        <div className="px-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h3
              className={cn(
                "flex-1 text-xl font-medium line-clamp-1 flex items-center gap-2",
                item.featured && "text-gradient_indigo-purple font-semibold",
              )}
            >
              {item.featured && <AwardIcon className="w-5 h-5 flex-shrink-0 text-indigo-500" />}
              {item.name}
            </h3>
            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="">Details</span>
              <ArrowRightIcon className={cn("size-4 icon-scale", "")} />
            </div>
          </div>

          {/* min-h-[3rem] is used for making sure height of the card is the same */}
          <p className="text-sm line-clamp-2 leading-relaxed min-h-[3rem]">
            {item.description}
          </p>
        </div>
      </Link>

      {/* bottom */}
      <div className="px-4 pb-4 flex justify-end items-center">
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {item.tags.slice(0, 5).map((tag, index) => (
              <Link
                key={tag._id}
                href={`/tag/${tag.slug.current}`}
                className="flex items-center justify-center space-x-0.5 group"
              >
                <HashIcon className="w-3 h-3 text-muted-foreground icon-scale" />
                <span className="text-sm text-muted-foreground link-underline">
                  {tag.name}
                </span>
              </Link>
            ))}
            {item.tags.length > 5 && (
              <span className="text-sm text-muted-foreground px-1">
                +{item.tags.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
