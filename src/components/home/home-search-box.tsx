"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createUrl } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

interface SearchBoxProps {
  urlPrefix: string;
}

export default function HomeSearchBox({ urlPrefix }: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [debouncedQuery] = useDebounce(searchQuery, 300); // 300ms debounce
  const lastExecutedQuery = useRef(searchParams?.get("q") || "");
  const previousQueryRef = useRef("");

  useEffect(() => {
    const currentQuery = searchParams?.get("q") || "";
    if (currentQuery !== previousQueryRef.current) {
      setSearchQuery(currentQuery);
      previousQueryRef.current = currentQuery;
    }
  }, [searchParams]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (debouncedQuery !== lastExecutedQuery.current) {
      const newParams = new URLSearchParams(searchParams?.toString());
      if (debouncedQuery) {
        newParams.set("q", debouncedQuery);
      } else {
        newParams.delete("q");
      }
      newParams.delete("page");
      const newUrl = createUrl(`${urlPrefix}`, newParams);
      console.log(`useEffect, newUrl: ${newUrl}`);
      lastExecutedQuery.current = debouncedQuery;
      router.push(newUrl, { scroll: false });
    }
  }, [debouncedQuery, router, searchParams, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex items-center justify-center">
      <Input
        type="text"
        placeholder="Search any products you need"
        autoComplete="off"
        value={searchQuery}
        onChange={handleSearch}
        className={cn(
          "w-[320px] sm:w-[480px] md:w-[640px] h-12 rounded-r-none",
          "focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary focus:border-2 focus:border-r-0",
        )}
      />
      <Button type="submit" className="rounded-l-none size-12">
        <SearchIcon className="size-6" aria-hidden="true" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
}
