import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";
import { SubmitStepper } from "@/components/submit/submit-stepper";

export default async function SubmitLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardSubmitHeader
        title="Submit"
        subtitle="Enter product details"
        label="1 / 3"
      >
        <SubmitStepper initialStep={1} />
      </DashboardSubmitHeader>

      <div className="mt-8">{children}</div>
    </div>
  );
}
