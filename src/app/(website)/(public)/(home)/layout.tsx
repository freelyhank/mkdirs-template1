import Container from "@/components/container";
import HomeHero from "@/components/home/home-hero";
import { HomeSearchFilter } from "@/components/home/home-search-filter";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";

export default function HomeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Container className="mt-12 mb-16 flex flex-col gap-12">
      <HomeHero />

      <div className="flex flex-col gap-8">
        <HomeSearchFilter urlPrefix="/" />

        {children}
      </div>

      <NewsletterCard />
    </Container>
  );
}
