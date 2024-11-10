"use client";

import { unpublish } from "@/actions/unpublish";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import type { ItemInfo } from "@/types";
import { ArrowDownToLineIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useTransition } from "react";
import { toast } from "sonner";

interface UnpublishButtonProps {
  item: ItemInfo;
}

export function UnpublishButton({ item }: UnpublishButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const unpublishAction = () => {
    startTransition(async () => {
      unpublish(item._id)
        .then((data) => {
          if (data.status === "success") {
            console.log("unpublishAction, success:", data.message);
            router.refresh();
            toast.success("Successfully unpublished");
          }
          if (data.status === "error") {
            console.error("unpublishAction, error:", data.message);
            toast.error("Failed to unpublish");
          }
        })
        .catch((error) => {
          console.error("unpublishAction, error:", error);
          toast.error("Failed to unpublish");
        });
    });
  };

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={unpublishAction}
      className="group overflow-hidden"
    >
      {isPending ? (
        <div className="flex items-center justify-center">
          <Icons.spinner className="mr-2 w-4 h-4 animate-spin" />
          <span>Unpublish</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <ArrowDownToLineIcon className="mr-2 w-4 h-4 icon-scale" />
          <span>Unpublish</span>
        </div>
      )}
    </Button>
  );
}
