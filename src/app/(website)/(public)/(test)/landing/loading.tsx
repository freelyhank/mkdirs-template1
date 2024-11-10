import { BlogGridSkeleton } from "@/components/blog/blog-grid";
import Container from "@/components/container";
import HomeHero from "@/components/home/home-hero";
import { ItemGridSkeleton } from "@/components/item/item-grid";

export default function Loading() {
  return (
    <div>
      {/* hero section */}
      <Container className="mt-12">
        <HomeHero />
      </Container>

      {/* home content */}
      <Container className="mt-12 flex flex-col gap-8">
        <ItemGridSkeleton count={6} />
        <ItemGridSkeleton count={6} />
        <BlogGridSkeleton count={6} />
      </Container>
    </div>
  );
}
