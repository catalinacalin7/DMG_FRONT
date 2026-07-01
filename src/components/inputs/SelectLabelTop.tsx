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
import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

type SelectInputProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  required?: boolean | undefined;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
};
const SelectLabelTop = ({
  fieldName,
  fieldLabel,
  options,
  placeholder,
  disabled,
}: SelectInputProps) => {
  const { control, watch } = useFormContext();
  const tPlaceholder = useTranslations("ui");
  watch();

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem key={field.value} className="w-full gap-0">
            <FormLabel className="text-nowrap text-base lg:pr-14">
              {fieldLabel}
            </FormLabel>

            <Select
              name={field.name}
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="w-full text-[14px]" size="md">
                  <SelectValue
                    placeholder={
                      placeholder ?? tPlaceholder("placeholders.chooseAnOption")
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {options &&
                  options.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <FormMessage className="text-red-500" />
          </FormItem>
        );
      }}
    />
  );
};

export default SelectLabelTop;
