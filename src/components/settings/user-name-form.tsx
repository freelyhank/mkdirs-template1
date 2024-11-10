"use client";

import { updateUserName } from "@/actions/update-name";
import { SectionColumns } from "@/components/settings/section-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import { type UserNameData, UserNameSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "../icons/icons";

export function UserNameForm() {
  const user = useCurrentUser();
  // console.log('UserNameForm, user:', user);
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();

  const checkUpdate = (value: string) => {
    setUpdated(user?.name !== value);
  };

  const form = useForm<UserNameData>({
    resolver: zodResolver(UserNameSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    console.log("UserNameForm, values:", values);
    startTransition(() => {
      updateUserName(values)
        .then((data) => {
          if (data.status === "error") {
            console.log("UserNameForm, error:", data.message);
            toast.error(data.message);
          }
          if (data.status === "success") {
            console.log("UserNameForm, success:", data.message);
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
        title="Your Name"
        description="Please enter your display name"
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            className="flex-1"
            size={32}
            {...form.register("name")}
            placeholder="Enter your name, max 32 characters"
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
          {form.formState.errors?.name && (
            <p className="pb-0.5 text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}

          <p className="text-[13px] text-muted-foreground">Max 32 characters</p>
        </div>
      </SectionColumns>
    </form>
  );
}
