import { CategoryFilter } from "@/components/category/category-filter";
import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";

export default function CategoryLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            labelAs="h1"
            label="Category"
            titleAs="h2"
            title="Explore by categories"
          />

          <div className="w-full">
            <CategoryFilter />
          </div>
        </div>
      </div>

      <Container className="mt-4">{children}</Container>
    </div>
  );
}
