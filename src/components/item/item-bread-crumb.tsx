import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ItemInfo } from "@/types";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDownIcon, HomeIcon } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ItemBreadCrumbProps {
  item: ItemInfo;
}

/**
 * breadcrumb for item
 */
export default function ItemBreadCrumb({ item }: ItemBreadCrumbProps) {
  return (
    <Breadcrumb className="text-base">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={"/"}>
            <div className="flex items-center gap-1">
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </div>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={"/category"}>
            <span>Category</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* show BreadcrumbLink if category is only one */}
          {item?.categories?.length === 1 && (
            <BreadcrumbLink
              className="cursor-pointer"
              href={`/category/${item?.categories?.[0]?.slug?.current}`}
            >
              {item?.categories?.[0]?.name}
            </BreadcrumbLink>
          )}

          {/* show dropdown menu if category is more than one */}
          {item?.categories?.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1">
                <BreadcrumbLink
                  className="cursor-pointer"
                  href={`/category/${item?.categories?.[0]?.slug?.current}`}
                >
                  {item?.categories?.[0]?.name}
                </BreadcrumbLink>
                <ChevronsUpDownIcon className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {item?.categories?.map((category) => (
                  <DropdownMenuItem key={category.slug.current}>
                    <BreadcrumbLink
                      className="cursor-pointer"
                      href={`/category/${category.slug.current}`}
                    >
                      {category.name}
                    </BreadcrumbLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">{item?.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
