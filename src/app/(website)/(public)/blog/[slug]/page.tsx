import AllPostsButton from "@/components/blog/all-posts-button";
import BlogCustomMdx from "@/components/blog/blog-custom-mdx";
import BlogGrid from "@/components/blog/blog-grid";
import { BlogToc } from "@/components/blog/blog-toc";
import { UserAvatar } from "@/components/shared/user-avatar";
import { siteConfig } from "@/config/site";
import { urlForImage } from "@/lib/image";
import { portableTextToMarkdown } from "@/lib/mdx";
import { constructMetadata } from "@/lib/metadata";
import { getTableOfContents } from "@/lib/toc";
import { getLocaleDate } from "@/lib/utils";
import type {
  BlogPostMetadataQueryResult,
  BlogPostQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { blogPostMetadataQuery, blogPostQuery } from "@/sanity/lib/queries";
import { FileTextIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const post = await sanityFetch<BlogPostMetadataQueryResult>({
    query: blogPostMetadataQuery,
    params: { slug: params.slug },
  });
  if (!post) {
    console.warn(`generateMetadata, post not found for slug: ${params.slug}`);
    return;
  }

  const imageProps = post?.image ? urlForImage(post?.image) : null;

  return constructMetadata({
    title: `${post.title}`,
    description: post.excerpt,
    canonicalUrl: `${siteConfig.url}/blog/${params.slug}`,
    image: imageProps?.src,
  });
}

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const slug = params.slug;
  const queryParams = { slug };
  const post = await sanityFetch<BlogPostQueryResult>({
    query: blogPostQuery,
    params: queryParams,
  });
  if (!post) {
    console.error("PostPage, post not found");
    return notFound();
  }

  // console.log("PostPage, post", post);
  const imageProps = post?.image ? urlForImage(post?.image) : null;
  const imageBlurDataURL = post?.image?.blurDataURL || null;
  const publishDate = post.publishDate || post._createdAt;
  const date = getLocaleDate(publishDate);
  const markdownContent = portableTextToMarkdown(post.body);
  // console.log("markdownContent", markdownContent);

  const toc = await getTableOfContents(markdownContent);

  return (
    <div className="flex flex-col gap-8">
      {/* Content section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Basic information */}
          <div className="space-y-8">
            {/* blog post image */}
            <div className="group overflow-hidden relative aspect-[16/9] rounded-lg transition-all border">
              {imageProps && (
                <Image
                  src={imageProps.src}
                  alt={post.image?.alt || "image for blog post"}
                  loading="eager"
                  fill
                  className="object-cover"
                  {...(imageBlurDataURL && {
                    placeholder: "blur",
                    blurDataURL: imageBlurDataURL,
                  })}
                />
              )}
            </div>

            {/* blog post title */}
            <h1 className="text-3xl font-bold">{post.title}</h1>

            {/* blog post description */}
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          </div>

          {/* blog post content */}
          <div className="mt-4">
            {markdownContent && <BlogCustomMdx source={markdownContent} />}
          </div>

          <div className="flex items-center justify-start mt-16">
            <AllPostsButton />
          </div>
        </div>

        {/* Right column (sidebar) */}
        <div>
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* author info */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Publisher</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <UserAvatar
                    name={post.author?.name || null}
                    image={post.author?.image || null}
                    className="border"
                  />
                </div>
                <div>
                  {post.author?.link ? (
                    <Link
                      href={post.author.link}
                      target="_blank"
                      prefetch={false}
                      className="font-medium link-underline"
                    >
                      {post.author.name}
                    </Link>
                  ) : (
                    <span>{post.author.name}</span>
                  )}

                  <p className="text-sm text-muted-foreground">{date}</p>
                </div>
              </div>
            </div>

            {/* categories */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <ul className="flex flex-wrap gap-4">
                {post.categories?.map((category) => (
                  <li key={category._id}>
                    <Link
                      href={`/blog/category/${category.slug.current}`}
                      className="text-sm link-underline"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* table of contents */}
            <div className="bg-muted/50 rounded-lg p-6 hidden lg:block">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
                <BlogToc toc={toc} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section shows related posts */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <div className="flex flex-col gap-8 mt-8">
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-4 h-4 text-indigo-500" />
            <h2 className="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              More Posts
            </h2>
          </div>

          <BlogGrid posts={post.relatedPosts} />
        </div>
      )}
    </div>
  );
}
