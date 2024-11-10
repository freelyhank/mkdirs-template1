"use client";

import { type SubmitFormData, submit } from "@/actions/submit";
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
import { SubmitSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import type {
  CategoryListQueryResult,
  TagListQueryResult,
} from "@/sanity.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SmileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SubmitFormProps {
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
export function SubmitForm({ tagList, categoryList }: SubmitFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  // set default values for form fields and validation schema
  const form = useForm<SubmitFormData>({
    resolver: zodResolver(SubmitSchema),
    defaultValues: {
      name: "",
      link: "",
      description: "",
      introduction: "",
      imageId: "",
      tags: [],
      categories: [],
    },
  });

  // submit form if data is valid
  const onSubmit = form.handleSubmit((data: SubmitFormData) => {
    // console.log('SubmitForm, onSubmit, data:', data);
    startTransition(async () => {
      submit(data)
        .then((data) => {
          if (data.status === "success") {
            console.log("SubmitForm, success:", data.message);
            form.reset();
            router.push(`/payment/${data.id}`);
            toast.success(data.message);
          }
          if (data.status === "error") {
            console.error("SubmitForm, error:", data.message);
            toast.error(data.message);
          }
        })
        .catch((error) => {
          console.error("SubmitForm, error:", error);
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
          <CardContent className="mt-6 space-y-6">
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
                        <span className="text-xs text-muted-foreground">
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
                        <span className="text-xs text-muted-foreground">
                          (PNG or JPEG, max 1MB)
                        </span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="mt-4 w-full h-[370px]">
                        <ImageUpload onUploadChange={handleUploadChange} />
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
              "sm:flex-row sm:justify-between sm:space-y-0",
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
                  ? "Submitting..."
                  : isUploading
                    ? "Uploading image..."
                    : "Submit"}
              </span>
            </Button>
            <div className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
              <SmileIcon className="h-6 w-4" />
              <span>No worries, you can change these information later.</span>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export function SubmitFormSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="mt-6 space-y-6">
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
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-40" />
            </div>
            <Skeleton className="h-[370px] w-full" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-[370px] w-full" />
          </div>
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          "flex flex-col items-stretch space-y-4 border-t bg-accent px-6 py-4",
          "sm:flex-row sm:justify-between sm:space-y-0",
        )}
      >
        <Skeleton className="h-12 w-full sm:w-32" />
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Skeleton className="h-8 w-4" />
          <Skeleton className="h-8 w-64" />
        </div>
      </CardFooter>
    </Card>
  );
}
