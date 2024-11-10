"use client";

import { type EditFormData, edit } from "@/actions/edit";
import { Icons } from "@/components/icons/icons";
import CustomMde from "@/components/shared/custom-mde";
import ImageUpload from "@/components/shared/image-upload";
import { MultiSelect } from "@/components/shared/multi-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { urlForImage } from "@/lib/image";
import { EditSchema } from "@/lib/schemas";
import { PricePlans } from "@/lib/submission";
import { cn } from "@/lib/utils";
import type {
  CategoryListQueryResult,
  TagListQueryResult,
} from "@/sanity.types";
import type { ItemFullInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRingIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditFormProps {
  item: ItemFullInfo;
  tagList: TagListQueryResult;
  categoryList: CategoryListQueryResult;
}

/**
 * 1. form component form shadcn/ui
 * https://ui.shadcn.com/docs/components/form
 *
 * 2. React Hook Form
 * https://react-hook-form.com/get-started
 */
export function EditForm({ item, tagList, categoryList }: EditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  // set default values for form fields and validation schema
  const form = useForm<EditFormData>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      id: item._id,
      name: item.name,
      link: item.link,
      description: item.description,
      introduction: item.introduction,
      imageId: item.image?.asset?._ref,
      tags: item.tags.map((tag) => tag._id),
      categories: item.categories.map((category) => category._id),
      pricePlan: item.pricePlan,
      planStatus:
        item.pricePlan === PricePlans.FREE
          ? item.freePlanStatus
          : item.proPlanStatus,
    },
  });

  // submit form if data is valid
  const onSubmit = form.handleSubmit((data: EditFormData) => {
    // console.log('EditForm, onSubmit, data:', data);
    startTransition(async () => {
      edit(data)
        .then((data) => {
          if (data.status === "success") {
            console.log("EditForm, success:", data.message);
            form.reset();
            router.push("/dashboard/");
            toast.success(data.message);
          }
          if (data.status === "error") {
            console.error("EditForm, error:", data.message);
            toast.error(data.message);
          }
        })
        .catch((error) => {
          console.error("EditForm, error:", error);
          toast.error("Something went wrong");
        });
    });
  });

  const handleUploadChange = (status: {
    isUploading: boolean;
    imageId?: string;
  }) => {
    setIsUploading(status.isUploading);
    if (status.imageId) {
      form.setValue("imageId", status.imageId);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className="overflow-hidden">
          <CardContent className="mt-4 space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the link to your product"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name of your product"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <MultiSelect
                        className="shadow-none"
                        options={categoryList.map((category) => ({
                          value: category._id,
                          label: category.name || "",
                        }))}
                        onValueChange={(selected) => field.onChange(selected)}
                        defaultValue={field.value}
                        placeholder="Select categories"
                        variant="default"
                        maxCount={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiSelect
                        className="shadow-none"
                        options={tagList.map((tag) => ({
                          value: tag._id,
                          label: tag.name || "",
                        }))}
                        onValueChange={(selected) => field.onChange(selected)}
                        defaultValue={field.value}
                        placeholder="Select tags"
                        variant="default"
                        maxCount={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a brief description of your product"
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <FormField
                control={form.control}
                name="introduction"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      <div className="flex items-center justify-between gap-4">
                        <span>Introduction</span>
                        <span className="text-sm text-muted-foreground">
                          (Markdown supported)
                        </span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <CustomMde {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      <div className="flex items-center justify-between gap-4">
                        <span>Image</span>
                        <span className="text-sm text-muted-foreground">
                          (PNG or JPEG, max 1MB)
                        </span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="mt-4 w-full h-[370px]">
                        <ImageUpload
                          onUploadChange={handleUploadChange}
                          currentImageUrl={urlForImage(item.image).src}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter
            className={cn(
              "flex flex-col items-stretch space-y-4 border-t bg-accent px-6 py-4",
              "sm:flex-row sm:justify-between sm:space-y-0 sm:gap-4",
            )}
          >
            <Button
              size="lg"
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending || isUploading}
            >
              {(isPending || isUploading) && (
                <Icons.spinner className="mr-2 h-6 w-4 animate-spin" />
              )}
              <span>
                {isPending
                  ? "Updating..."
                  : isUploading
                    ? "Uploading image..."
                    : "Update"}
              </span>
            </Button>

            {/* NOTICE: if this item is in free plan, any update will cause this item to be reviewed again */}
            {item.pricePlan === PricePlans.FREE && (
              <div className="text-muted-foreground flex items-center justify-center sm:justify-start gap-4">
                <BellRingIcon className="h-5 w-5 sm:h-6 sm:w-4 flex-shrink-0" />
                <span className="text-sm">
                  Your submission will be reviewed again and remain unpublished
                  until approved.
                </span>
              </div>
            )}

            {/* NOTICE: if this item is in pro plan, any update will cause this item to be reviewed again */}
            {item.pricePlan === PricePlans.PRO && (
              <div className="text-muted-foreground flex items-center justify-center sm:justify-start gap-4">
                <BellRingIcon className="h-5 w-5 sm:h-6 sm:w-4 flex-shrink-0" />
                <span className="text-sm">
                  Your changes will be visible on the site until the cache
                  refreshes (usually takes 1 minute).
                </span>
              </div>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export function EditFormSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="mt-4 space-y-6">
        {/* Link and Name fields */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
          {[...Array(2)].map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="flex-1 space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>

        {/* Categories and Tags fields */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
          {[...Array(2)].map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="flex-1 space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>

        {/* Description field */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Introduction and Image fields */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-[370px] w-full" />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-[370px] w-full" />
          </div>
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          "flex flex-col items-stretch space-y-4 border-t bg-accent px-6 py-4",
          "sm:flex-row sm:justify-between sm:space-y-0 sm:gap-4",
        )}
      >
        <Skeleton className="h-12 w-full sm:w-32" />
        <div className="flex items-center justify-center sm:justify-start gap-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
      </CardFooter>
    </Card>
  );
}
