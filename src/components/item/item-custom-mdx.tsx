import { CustomMdx } from "@/components/shared/custom-mdx";
import { cn } from "@/lib/utils";

interface ItemCustomMdxProps {
  source: string;
}

export default function ItemCustomMdx({ source }: ItemCustomMdxProps) {
  return <CustomMdx source={source} components={markdownComponents} />;
}

/**
 * submitters may use h1, h2, h3 to define the heading of introduction section,
 * but we use h4, h5, h6 to define the heading of introduction section,
 * so we need to map h1, h2, h3 to h4, h5, h6
 */
const markdownComponents = {
  h1: ({ className, ...props }) => (
    <h4
      className={cn("mt-8 scroll-m-20 text-xl font-semibold", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h5
      className={cn("mt-8 scroll-m-20 text-lg font-semibold", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h6
      className={cn("mt-8 scroll-m-20 text-base font-semibold", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      rel="nofollow noopener noreferrer"
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
};
