import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import Link from "next/link";

export default function EmptySubmission() {
  return (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="submit" className="size-8" />
      <EmptyPlaceholder.Title>No submissions</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        You don&apos;t have any submissions yet.
      </EmptyPlaceholder.Description>
      <Button asChild size="lg" className="group whitespace-nowrap">
        <Link
          href="/submit"
          prefetch={false}
          className="flex items-center justify-center space-x-2"
        >
          <UploadIcon className="w-4 h-4" />
          <span>Submit</span>
        </Link>
      </Button>
    </EmptyPlaceholder>
  );
}
