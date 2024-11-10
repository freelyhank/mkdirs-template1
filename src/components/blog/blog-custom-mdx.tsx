import { CustomMdx } from "@/components/shared/custom-mdx";
import { cn } from "@/lib/utils";

interface BlogCustomMdxProps {
  source: string;
}

export default function BlogCustomMdx({ source }: BlogCustomMdxProps) {
  return <CustomMdx source={source} components={markdownComponents} />;
}

/**
 * blog authors may use h1, h2, h3 to define the heading of introduction section,
 * but we use h2, h3, h4 to define the heading of introduction section,
 * h1 is used for the title of the blog post,
 * so we need to map h1, h2, h3 to h2, h3, h4
 */
const markdownComponents = {
  h1: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 text-3xl font-semibold border-b pb-1 first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h3
      className={cn("mt-8 scroll-m-20 text-2xl font-semibold", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h4
      className={cn("mt-8 scroll-m-20 text-xl font-semibold", className)}
      {...props}
    />
  ),
};
