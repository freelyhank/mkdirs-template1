import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";
import Container from "@/components/container";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { HeaderSection } from "@/components/shared/header-section";

export default async function BlogListLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <div className="mt-8 w-full flex flex-col items-center justify-center gap-8">
        <HeaderSection
          labelAs="h1"
          label="Blog"
          titleAs="h2"
          title="Read our latest blog posts"
        />

        <BlogCategoryFilter />
      </div>

      <Container className="mt-8">{children}</Container>

      <Container className="mt-8">
        <NewsletterCard />
      </Container>
    </div>
  );
}
