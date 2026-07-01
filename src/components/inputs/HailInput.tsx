"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type HailInputProps = {
  fieldName: string;
  panelName?: string;
  type?: string;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string | undefined;
  startIcon?: React.ReactNode;
  inputMode?:
    | "search"
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal";
};

function HailInput({
  fieldName,
  panelName,
  placeholder,
  readonly,
  disabled,
  startIcon,
  type = "text",
  inputMode = "numeric",
}: HailInputProps) {
  const { control, trigger, watch } = useFormContext();
  const key = `${fieldName}-${panelName}`;

  return (
    <Controller
      control={control}
      name={fieldName}
      key={key}
      render={() => (
        <FormField
          control={control}
          name={fieldName}
          key={key}
          render={({ field, formState: errors }) => {
            return (
              <FormItem>
                <Input
                  placeholder={placeholder}
                  type={type}
                  min={0}
                  value={field.value}
                  inputMode={inputMode}
                  isError={!errors}
                  onChange={field.onChange}
                  readOnly={readonly}
                  disabled={disabled}
                  startIcon={startIcon}
                  className={`border-input bg-background focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${startIcon ? "text-right" : ""}`}
                />

                <FormMessage className="text-red-500" />
              </FormItem>
            );
          }}
        />
      )}
    />
  );
}
export default HailInput;
