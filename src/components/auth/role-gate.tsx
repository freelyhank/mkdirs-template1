"use client";

import { FormError } from "@/components/shared/form-error";
import { useCurrentRole } from "@/hooks/use-current-role";
import type { UserRole } from "@/types/user-role";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  return <div>{children}</div>;
};
