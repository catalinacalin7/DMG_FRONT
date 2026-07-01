"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Label } from "../ui/label";

type SearchSelectorProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  required?: boolean | undefined;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  onSelect?: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchSelector({
  fieldName,
  fieldLabel,
  options,
  placeholder,
  disabled,
  onSelect,
}: SearchSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field: { value } }) => {
        return (
          <FormItem className="w-full gap-0">
            <FormLabel className="text-base">{fieldLabel}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between rounded-md"
                >
                  {options
                    ? options.find((option) => option.value === value)?.label
                    : "Select estimate..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search estimate..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No estimates found</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            setValue(fieldName, currentValue);
                            onSelect(currentValue);
                            setOpen(false);
                          }}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === option.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage className="text-red-500" />
          </FormItem>
        );
      }}
    />
  );
}
