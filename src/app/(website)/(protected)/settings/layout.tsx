import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function SettingsLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardHeader title="Settings" subtitle="Manage account settings" />

      <div className="mt-8">{children}</div>
    </div>
  );
}
