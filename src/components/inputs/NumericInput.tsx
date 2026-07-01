"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type NumericInputProps = {
  fieldName: string;
  required?: boolean | undefined;
  id?: string;
  type?: string;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string | undefined;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
};

function NumericInput({
  fieldName,
  required,
  id,
  placeholder,
  readonly,
  disabled,
  type = "text",
  step,
  min,
  max,
  className,
}: NumericInputProps) {
  const { control, trigger, watch } = useFormContext();
  watch();
  return (
    <FormField
      control={control}
      name={fieldName}
      render={() => {
        return (
          <FormField
            control={control}
            name={fieldName}
            render={({
              field: { value, onChange },
              fieldState: { error },
              formState: { errors },
            }) => (
              <FormItem>
                <div>
                  <FormControl>
                    <Input
                      placeholder={placeholder}
                      type={type}
                      step={step}
                      min={min}
                      max={max}
                      id={id}
                      value={value}
                      isError={!!errors[fieldName]}
                      onChange={onChange}
                      readOnly={readonly}
                      disabled={disabled}
                      className={`flex w-16 items-center justify-center px-0 text-center text-xs md:w-36 md:text-base ${className ?? ""}`}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        );
      }}
    />
  );
}
export default NumericInput;
