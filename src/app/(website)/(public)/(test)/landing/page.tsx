import Container from "@/components/container";
import { LandingContent } from "@/components/landing/landing-content";
import LandingHero from "@/components/landing/landing-hero";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Home",
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function LandingPage() {
  return (
    <Container className="mt-12 mb-16 flex flex-col gap-12">
      <LandingHero />

      <LandingContent />

      <NewsletterCard />
    </Container>
  );
}
