import { DashboardButton } from "@/components/dashboard/dashboard-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardHeader title="Dashboard" subtitle="Overview of submissions">
        <div className="flex items-center space-x-4">
          <DashboardButton />

          <Button asChild disabled className="group whitespace-nowrap">
            <Link
              href="/submit"
              prefetch={false}
              className="flex items-center justify-center space-x-2"
            >
              <UploadIcon className="w-4 h-4" />
              <span>Submit</span>
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="mt-8">{children}</div>
    </div>
  );
}
