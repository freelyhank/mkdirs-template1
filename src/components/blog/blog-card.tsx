import { Skeleton } from "@/components/ui/skeleton";
import { urlForImage } from "@/lib/image";
import { getLocaleDate } from "@/lib/utils";
import type { BlogPostInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { UserAvatar } from "../shared/user-avatar";

type BlogCardProps = {
  post: BlogPostInfo;
};

export default function BlogCard({ post }: BlogCardProps) {
  const imageProps = post?.image ? urlForImage(post.image) : null;
  const imageBlurDataURL = post?.image?.blurDataURL || null;
  const publishDate = post.publishDate || post._createdAt;
  const date = getLocaleDate(publishDate);
  const postUrlPrefix = "/blog";

  return (
    <div className="group cursor-pointer flex flex-col gap-4">
      {/* Image container */}
      <div className="group overflow-hidden relative aspect-[4/3] rounded-lg transition-all">
        <Link href={`${postUrlPrefix}/${post.slug.current}`}>
          {imageProps && (
            <div className="relative w-full h-full">
              <Image
                src={imageProps.src}
                alt={post.image.alt || "image for blog post"}
                className="object-cover image-scale"
                fill
                {...(imageBlurDataURL && {
                  placeholder: "blur",
                  blurDataURL: imageBlurDataURL,
                })}
              />

              {post.categories && post.categories.length > 0 && (
                <div className="absolute left-2 bottom-2 opacity-100 transition-opacity duration-300">
                  <div className="flex flex-wrap gap-1">
                    {post.categories.map((category, index) => (
                      <span
                        key={category._id}
                        className="text-xs font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded-md"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Link>
      </div>

      {/* Post info container */}
      <div className="flex flex-col flex-grow">
        <div>
          {/* Post title */}
          <h3 className="text-lg line-clamp-2 font-medium">
            <Link href={`${postUrlPrefix}/${post.slug.current}`}>
              <span
                className="bg-gradient-to-r from-green-200 to-green-100 
                  bg-[length:0px_10px] bg-left-bottom bg-no-repeat
                  transition-[background-size]
                  duration-500
                  hover:bg-[length:100%_3px]
                  group-hover:bg-[length:100%_10px]
                  dark:from-purple-800 dark:to-purple-900"
              >
                {post.title}
              </span>
            </Link>
          </h3>

          {/* Post excerpt, hidden for now */}
          {/* <div className="hidden">
            {post.excerpt && (
              <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                <Link
                  href={`${postUrlPrefix}/${post.slug.current}`}>
                  {post.excerpt}
                </Link>
              </p>
            )}
          </div> */}
        </div>

        {/* Author and date */}
        <div className="mt-auto pt-4 flex items-center justify-between space-x-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserAvatar
              name={post.author?.name || null}
              image={post.author?.image || null}
              className="border h-6 w-6 flex-shrink-0"
            />
            <span className="truncate text-sm">{post?.author?.name}</span>
          </div>

          <time className="truncate text-sm" dateTime={date}>
            {date}
          </time>
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="group cursor-pointer flex flex-col gap-4">
      <div className="group overflow-hidden relative aspect-[4/3] rounded-lg transition-all">
        <Skeleton className="w-full aspect-[4/3] rounded-lg" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
