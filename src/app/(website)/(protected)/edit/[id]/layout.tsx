import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function EditLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardHeader
        title="Edit"
        subtitle="Update product info"
        showBackButton={true}
      />

      <div className="mt-8">{children}</div>
    </div>
  );
}
