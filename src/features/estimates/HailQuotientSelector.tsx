"use client";
import { useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { HailMatrix, HailMatrixData } from "@/types/matrices";
import { Controller, useFormContext } from "react-hook-form";

type HailRadioGroupProps = {
  fieldName: string;
  fieldId?: string;
  quotient: string;
  damageLevel: "light" | "medium" | "strong";
  matrix: HailMatrix;
};

function HailQuotientSelector({
  fieldName,
  fieldId,
  quotient,
  damageLevel,
  matrix,
}: HailRadioGroupProps) {
  const { control, watch, setValue, getValues } = useFormContext();

  const selectedValue = watch(`${fieldName}`);
  const selectedQuotient = matrix?.matrixData.find(
    (item) => item.unit === selectedValue,
  ) as HailMatrixData;

  useEffect(() => {
    const val = selectedQuotient?.[damageLevel];
    if (selectedValue && val !== undefined) {
      setValue(`${quotient}`, val);
    }
  }, [damageLevel, quotient, selectedQuotient, selectedValue, setValue]);

  const key = `${fieldId}-${getValues(fieldName) || ""}`;

  watch();
  return (
    <Controller
      control={control}
      name={fieldName}
      key={key}
      render={({ field }) => {
        return (
          <FormItem className="flex w-full gap-1 space-y-0">
            <Select
              onValueChange={(value) => {
                field.onChange(value);
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {matrix?.matrixData.map((matrix) => {
                  return (
                    <div key={matrix.unit}>
                      <SelectItem value={matrix.unit}>{matrix.unit}</SelectItem>
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          </FormItem>
        );
      }}
    />
  );
}

export default HailQuotientSelector;
