"use client";

import { updateUserLink } from "@/actions/update-link";
import { SectionColumns } from "@/components/settings/section-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import { type UserLinkData, UserLinkSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "../icons/icons";

export function UserLinkForm() {
  const user = useCurrentUser();
  // console.log('UserLinkForm, user:', user);
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();

  const checkUpdate = (value: string) => {
    setUpdated(user?.link !== value);
  };

  const form = useForm<UserLinkData>({
    resolver: zodResolver(UserLinkSchema),
    defaultValues: {
      link: user?.link || "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    console.log("UserLinkForm, values:", values);
    startTransition(() => {
      updateUserLink(values)
        .then((data) => {
          if (data.status === "error") {
            console.log("UserLinkForm, error:", data.message);
            toast.error(data.message);
          }
          if (data.status === "success") {
            console.log("UserLinkForm, success:", data.message);
            update();
            setUpdated(false);
            toast.success(data.message);
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Your Link"
        description="Please enter your portfolio link"
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="name">
            Link
          </Label>
          <Input
            id="link"
            className="flex-1"
            size={128}
            {...form.register("link")}
            placeholder="Enter your link, max 128 characters"
            onChange={(e) => checkUpdate(e.target.value)}
          />
          <Button
            type="submit"
            disabled={isPending || !updated}
            className=""
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Icons.spinner className="size-4 animate-spin" />
                <p>Saving...</p>
              </div>
            ) : (
              <p>
                Save
                <span className="hidden sm:inline-flex">&nbsp;Changes</span>
              </p>
            )}
          </Button>
        </div>
        <div className="flex flex-col justify-between p-1">
          {form.formState.errors?.link && (
            <p className="pb-0.5 text-sm text-red-500">
              {form.formState.errors.link.message}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">
            Max 128 characters
          </p>
        </div>
      </SectionColumns>
    </form>
  );
}
