"use client";

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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { Value } from "@radix-ui/react-select";
import { useState } from "react";

type InputSearchSelectorProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  required?: boolean | undefined;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  labelPosition?: "top" | "left";
  onFieldChange?: React.Dispatch<React.SetStateAction<string>>;
};

export function InputSearchSelector({
  fieldName,
  fieldLabel,
  options,
  placeholder,
  disabled,
  labelPosition,
  onFieldChange,
}: InputSearchSelectorProps) {
  const { control, setValue, watch } = useFormContext();
  const [inputValue, setInputValue] = useState<String>("");

  return (
    <div>
      <FormField
        control={control}
        name={fieldName}
        render={({ field }) => {
          return (
            <FormItem
              className={`grid grid-cols-1 place-items-start justify-items-start gap-0 ${labelPosition === "top" ? "" : "lg:grid-cols-2 lg:gap-4 xl:grid-cols-3"}`}
            >
              <FormLabel className="text-base">{fieldLabel}</FormLabel>
              <Combobox
                value={field.value || ""}
                inputValue={field.value as string}
                onInputValueChange={(value) => {
                  setInputValue(value);
                  field.onChange(value);
                }}
                // onValueChange={field.onChange}
                onValueChange={(value) => {
                  setInputValue(value);
                  field.onChange(value);
                }}
                items={options}
              >
                <div className="flex w-full flex-col">
                  <ComboboxInput
                    onChange={(e) => {
                      onFieldChange(e.target.value);
                      setInputValue(e.target.value);
                    }}
                    // onBlur={() => {
                    //   if (!field.value) {
                    //     field.onChange(inputValue);
                    //   }
                    // }}
                    className="w-full text-base"
                  />
                  <FormMessage className="text-red-500" />
                </div>
                <ComboboxContent className="max-w-[50%] bg-white">
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList className="">
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FormItem>
          );
        }}
      />
    </div>
  );
}
