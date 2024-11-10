import BackButtonSmall from "../shared/back-button-small";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export function DashboardHeader({
  title,
  subtitle,
  children,
  showBackButton = false,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col space-y-4">
        {/* title */}
        <div className="flex items-center space-x-4">
          {showBackButton && <BackButtonSmall href="/dashboard" />}

          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>

        {/* subtitle */}
        {subtitle && (
          <h2 className="text-base text-muted-foreground">{subtitle}</h2>
        )}
      </div>

      {/* actions */}
      {children}
    </div>
  );
}
