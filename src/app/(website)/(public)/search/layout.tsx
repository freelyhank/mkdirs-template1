import Container from "@/components/container";
import { SearchFilter } from "@/components/search/search-filter";
import { HeaderSection } from "@/components/shared/header-section";

export default function SearchLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            labelAs="h1"
            label="Search"
            titleAs="h2"
            title="Search anything you want"
          />

          <div className="w-full">
            <SearchFilter urlPrefix="/search" />
          </div>
        </div>
      </div>

      <Container className="mt-8">{children}</Container>
    </div>
  );
}
