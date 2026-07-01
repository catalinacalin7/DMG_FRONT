import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { MultiSelect } from "../MultiSelect";
import { useTranslations } from "next-intl";

type SelectInputProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  required?: boolean | undefined;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
};

const MultiSelectInput = ({
  fieldName,
  fieldLabel,
  options,
  placeholder,
  disabled,
}: SelectInputProps) => {
  const tUI = useTranslations("ui");
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className="grid grid-cols-1 place-items-start justify-items-start lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
            <FormLabel className="text-nowrap text-[16px] font-semibold lg:pr-14">
              {fieldLabel}
            </FormLabel>
            <div className="w-full">
              <FormControl>
                <MultiSelect
                  options={options}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder={
                    placeholder ?? tUI("placeholders.chooseAnOption")
                  }
                  variant="inverted"
                  disabled={disabled}
                />
              </FormControl>

              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
};

export default MultiSelectInput;
