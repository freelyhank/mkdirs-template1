import Container from "@/components/container";

export default function CustomPageLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div>
      <Container className="mt-8 mb-16">{children}</Container>
    </div>
  );
}
