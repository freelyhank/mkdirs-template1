import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";
import { SubmitStepper } from "@/components/submit/submit-stepper";

export default async function PublishLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardSubmitHeader
        title="Submit"
        subtitle="Review and publish product"
        label="3 / 3"
      >
        <SubmitStepper initialStep={3} />
      </DashboardSubmitHeader>

      <div className="mt-8">{children}</div>
    </div>
  );
}
