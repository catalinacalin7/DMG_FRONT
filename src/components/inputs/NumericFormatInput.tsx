import { cn } from "@/utils/cn";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
type NumericFormatInputProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  required?: boolean | undefined;
  thousandSeparator?: boolean | string;
  placeholder?: string;
  suffix?: string;
  valueIsNumericString?: boolean | undefined;
  readOnly?: boolean | undefined;
  disabled?: boolean | undefined;
  decimalScale?: number | undefined;
  step?: number;
};

const NumericFormatInput = ({
  fieldName,
  fieldLabel,
  placeholder,
  suffix,
  thousandSeparator = true,
  valueIsNumericString,
  readOnly,
  disabled,
  decimalScale = 0,
  step,
}: NumericFormatInputProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={fieldName}
      render={() => {
        return (
          <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className="grid grid-cols-1 place-items-start justify-items-start lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
                <FormLabel className="text-nowrap text-[16px] font-semibold lg:pr-14">
                  {fieldLabel}
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <NumericFormat
                      value={field.value}
                      onValueChange={(values) => field.onChange(values.value)}
                      placeholder={placeholder}
                      decimalScale={decimalScale}
                      allowNegative={false}
                      thousandSeparator={thousandSeparator}
                      suffix={suffix}
                      customInput={Input}
                      className="w-full"
                      allowLeadingZeros={false}
                      getInputRef={field.ref}
                      valueIsNumericString={valueIsNumericString}
                      fixedDecimalScale
                      readOnly={readOnly}
                      disabled={disabled}
                      step={step}
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
};

export default NumericFormatInput;
