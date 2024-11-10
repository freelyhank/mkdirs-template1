import "@/styles/mdx.css";

import { Callout } from "@/components/shared/callout";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import Link from "next/link";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

interface MdxProps {
  source?: string;
  // biome-ignore lint/suspicious/noExplicitAny: use any for components
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * https://github.com/ipikuka/next-mdx-remote-client
 */
export function CustomMdx({ source, components }: MdxProps) {
  if (!source) {
    console.error("CustomMdx, source is empty");
    return (
      <ErrorComponent error={new Error("Sorry, the content could not found")} />
    );
  }

  return (
    <article className="">
      <MDXRemote
        source={source}
        options={options}
        components={{
          ...markdownComponents,
          ...customComponents,
          ...(components || {}),
        }}
        onError={ErrorComponent}
      />
    </article>
  );
}

/**
 * The MDXClient has internal error handling mechanism as much as it can,
 * in order to do so, it takes onError prop in addition to hydrate function.
 */
const ErrorComponent = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col items-start justify-start">
      <h3 className="text-xl font-bold">Oops! Something went wrong</h3>
      <p className="mt-4 text-muted-foreground">{error.message}</p>
    </div>
  );
};

/**
 * 1. MDXRemoteOptions
 * https://github.com/ipikuka/next-mdx-remote-client?tab=readme-ov-file#the-mdxremote-options-mdxremoteoptions
 *
 * 2. mdxoptions
 * https://github.com/ipikuka/next-mdx-remote-client?tab=readme-ov-file#mdxoptions
 *
 * 2.1 remarkGfm plugin is used to display table, and automatically underline the text in the link
 * 2.2 rehypePrettyCode plugin is used to highlight code,
 * 2.3 rehypeAutolinkHeadings plugin is used to automatically generate anchors,
 * 2.4 With these plugins, we don't need the tailwindcss typography plugin anymore,
 *     but we need to manually add the mdx.css file to make the code highlighting work
 */
const options: MDXRemoteOptions = {
  mdxOptions: {
    // format: "mdx",
    // baseUrl: import.meta.url,
    // development: true,
    // recmaPlugins: [/* */],
    // remarkRehypeOptions: { handlers: {/* */ } },
    // remarkPlugins: [/* */],
    // rehypePlugins: [/* */],
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code") return;
            node.__rawString__ = codeEl.children?.[0].value;
          }
        });
      },
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: false,
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode,
            //and allow empty lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
        },
      ],
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "figure") {
            if (!("data-rehype-pretty-code-figure" in node.properties)) {
              return;
            }

            const preElement = node.children.at(-1);
            if (preElement.tagName !== "pre") {
              return;
            }

            preElement.properties.__rawString__ = node.__rawString__;
          }
        });
      },
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
  // disableExports?: boolean;
  // disableImports?: boolean;
  // parseFrontmatter?: boolean;
  // scope?: TScope;
  // vfileDataIntoScope?: VfileDataIntoScope;
};

/**
 * common markdown components
 */
const markdownComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn("mt-2 scroll-m-20 text-4xl font-bold", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 text-3xl font-semibold border-b pb-1 first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn("mt-8 scroll-m-20 text-2xl font-semibold", className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn("mt-8 scroll-m-20 text-xl font-semibold", className)}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn("mt-8 scroll-m-20 text-lg font-semibold", className)}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn("mt-8 scroll-m-20 text-base font-semibold", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/a11y/useAltText: <explanation>
    <img
      className={cn("rounded-md border my-2", className)}
      alt={alt || "Image"}
      {...props}
    />
  ),
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  pre: ({
    className,
    __rawString__,
    ...props
  }: React.HTMLAttributes<HTMLPreElement> & { __rawString__?: string }) => (
    <div className="group relative w-full overflow-hidden">
      <pre
        className={cn(
          "max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-900 py-4 dark:bg-zinc-900",
          className,
        )}
        {...props}
      />
      {__rawString__ && (
        <CopyButton
          value={__rawString__}
          className={cn(
            "absolute right-4 top-4 z-20",
            "duration-250 opacity-0 transition-all group-hover:opacity-100",
          )}
        />
      )}
    </div>
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "relative rounded-md border bg-muted px-[0.4rem] py-1 font-mono text-sm text-foreground",
        className,
      )}
      {...props}
    />
  ),
};

/**
 * custom components
 */
const customComponents = {
  Callout,
  Image: ({ className, ...props }: React.ComponentProps<"img">) => (
    // biome-ignore lint/a11y/useAltText: use alt="image" as default
    <img
      className={cn("rounded-md border my-2", className)}
      // biome-ignore lint/a11y/noRedundantAlt: use image as default alt
      alt="image"
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn("mt-8 scroll-m-20 text-xl font-semibold", className)}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
      {...props}
    />
  ),
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10",
        className,
      )}
      {...props}
    />
  ),
};
