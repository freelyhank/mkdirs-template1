"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import * as React from "react";

type FilterItem = {
  value: string | null;
  label: string;
};

// 1. DEFAULT_FILTER_VALUE can't be null,
// otherwise the combobox will not work
// 2. DEFAULT_FILTER_VALUE can't be empty string,
// otherwise the combobox doesn't show hover effect when the value is empty
export const DEFAULT_FILTER_VALUE = "%DEFAULT_FILTER_VALUE%";

export type ResponsiveComboBoxProps = {
  filterItemList: FilterItem[];
  placeholder: string;
  labelPrefix?: string;
  selectedValue: string | null;
  onValueChange: (value: string | null) => void;
};

export function ResponsiveComboBox({
  filterItemList,
  placeholder,
  labelPrefix,
  selectedValue,
  onValueChange,
}: ResponsiveComboBoxProps) {
  const { isDesktop } = useMediaQuery();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<FilterItem | null>(
    filterItemList.find((item) => item.value === selectedValue) || null,
  );

  React.useEffect(() => {
    setSelected(
      filterItemList.find((item) => item.value === selectedValue) || null,
    );
  }, [selectedValue, filterItemList]);

  const handleSelect = (item: FilterItem | null) => {
    setSelected(item);
    setOpen(false);
    if (item) {
      onValueChange(item.value);
    }
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-expanded={open}
            className="justify-between"
          >
            {selected && selected.value !== DEFAULT_FILTER_VALUE ? (
              <h2>
                {labelPrefix
                  ? `${labelPrefix}${selected.label}`
                  : selected.label}
              </h2>
            ) : (
              <h2>{placeholder}</h2>
            )}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <FilterList
            filterItemList={filterItemList}
            selectedValue={selectedValue}
            setOpen={setOpen}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start">
          {selected && selected.value !== DEFAULT_FILTER_VALUE ? (
            <h2>
              {labelPrefix ? `${labelPrefix}${selected.label}` : selected.label}
            </h2>
          ) : (
            <h2>{placeholder}</h2>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <FilterList
            filterItemList={filterItemList}
            selectedValue={selectedValue}
            setOpen={setOpen}
            onSelect={handleSelect}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function FilterList({
  filterItemList,
  selectedValue,
  setOpen,
  onSelect,
}: {
  filterItemList: FilterItem[];
  selectedValue: string;
  setOpen: (open: boolean) => void;
  onSelect: (item: FilterItem | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup className="">
          {filterItemList.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={() => {
                onSelect(item);
                setOpen(false);
              }}
              className="cursor-pointer p-3"
            >
              <CheckIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  item.value === selectedValue ? "opacity-100" : "opacity-0",
                )}
              />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
