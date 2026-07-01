"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

type TextInputProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  required?: boolean | undefined;
  placeholder?: string | undefined;
  multiline?: boolean | undefined;
  rows?: number | undefined;
  minRows?: number | undefined;
  maxRows?: number | undefined;
  type?: string;
  withButton?: React.ReactNode;
  isDialogForm?: boolean;
  isTextUpperCase?: boolean;
};

function TextInput({
  fieldName,
  fieldLabel,
  required,
  placeholder,
  type = "text",
  withButton,
  isDialogForm,
  isTextUpperCase,
}: TextInputProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem
            className={`grid grid-cols-1 place-items-start justify-items-start gap-1 lg:grid-cols-2 lg:gap-4 ${isDialogForm ? "lg:grid-cols-1 lg:gap-1" : "xl:grid-cols-3"}`}
          >
            <Label className="text-nowrap text-[16px] font-semibold lg:pr-14">
              {fieldLabel}
              {required && "*"}
            </Label>

            <div className="w-full">
              <div className="flex gap-2">
                <FormControl className="w-full">
                  <Input
                    placeholder={placeholder}
                    type={type}
                    {...field}
                    className={`${isTextUpperCase ? "uppercase" : ""} `}
                  />
                </FormControl>

                {withButton}
              </div>
              <FormMessage className="text-red-500" />
            </div>
          </FormItem>
        );
      }}
    />
  );
}
export default TextInput;
