"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@/types/user-role";
import { LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const DashboardButton = () => {
  const role = useCurrentRole();
  if (role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <Button
      asChild
      disabled
      variant="outline"
      className="group whitespace-nowrap"
    >
      <Link
        href="/studio"
        target="_blank"
        prefetch={false}
        className="flex items-center justify-center space-x-2"
      >
        <LayoutDashboardIcon className="w-4 h-4" />
        <span>Studio</span>
      </Link>
    </Button>
  );
};
