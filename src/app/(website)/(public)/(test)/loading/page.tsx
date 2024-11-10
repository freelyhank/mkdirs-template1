import Container from "@/components/container";
// import Loading from "../../[slug]/loading";
import Loading from "../../(home)/loading";
// import Loading from "@/app/(website)/loading";
// import Loading from "@/app/(website)/(protected)/(submit)/payment/[id]/loading";
// import Loading from "@/app/(website)/(protected)/(submit)/publish/[id]/loading";
// import Loading from "@/app/(website)/(protected)/(submit)/submit/loading";
// import Loading from "@/app/(website)/(protected)/dashboard/loading";
// import Loading from "@/app/(website)/(protected)/edit/[id]/loading";
// import Loading from "@/app/(website)/(protected)/settings/loading";
// import Loading from "@/app/(website)/(public)/category/loading";
// import Loading from "@/app/(website)/(public)/item/[slug]/loading";
// import Loading from "@/app/(website)/(public)/blog/(blog)/loading";
// import Loading from "@/app/(website)/(public)/blog/[slug]/loading";

/**
 * This is a loading page for testing purposes.
 */
export default function LoadingDemo() {
  return (
    <Container className="mt-8 pb-16">
      <Loading />
    </Container>
  );
}
