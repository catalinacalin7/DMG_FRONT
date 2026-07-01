"use client";
import { useRef, useEffect } from "react";
import { getMatrixById } from "@/api/matrices/hail-matrix";
import LoadingScreen from "@/components/LoadingScreen";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { HailMatrix } from "@/types/matrices";
import { useQuery } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";

type HailRadioGroupProps = {
  fieldName: string;
  fieldId?: string;
  quotient: string;
  damageLevel: "light" | "medium" | "strong";
  matrix: HailMatrix;
};

function HailRadioGroup({
  fieldName,
  fieldId,
  quotient,
  damageLevel,
  matrix,
}: HailRadioGroupProps) {
  const radioItemRef = useRef<HTMLDivElement | null>(null);
  const { control, watch, setValue } = useFormContext();
  const fieldValue = watch(fieldName);

  const color =
    damageLevel === "light"
      ? "hover:bg-green-600 peer-checked:bg-green-600"
      : damageLevel === "medium"
        ? "hover:bg-yellow-500 peer-checked:bg-yellow-500"
        : "hover:bg-red-500 peer-checked:bg-red-500";

  useEffect(() => {
    if (radioItemRef.current) {
      radioItemRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [fieldValue]);

  watch();
  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className="flex w-full gap-1 space-y-0 overflow-x-scroll px-2 py-6">
            {matrix?.matrixData.map((matrix) => {
              const isSelected = field.value === matrix.unit;
              return (
                <div
                  key={matrix.unit}
                  className="flex items-center justify-center"
                  ref={isSelected ? radioItemRef : null}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
                    <input
                      type="radio"
                      id={`${fieldId}-${matrix.unit}`}
                      value={matrix.unit}
                      checked={field.value === matrix.unit}
                      onChange={(value) => {
                        field.onChange(value);
                        setValue(`${quotient}`, matrix[damageLevel]);
                      }}
                      className="peer hidden"
                    />

                    <FormLabel
                      htmlFor={`${fieldId}-${matrix.unit}`}
                      className={`flex h-[70px] w-[70px] cursor-pointer select-none items-center justify-center rounded-full border-2 border-[#D1E9FF] transition-all duration-100 hover:border-none ${color} peer-checked:h-20 peer-checked:w-20 peer-checked:border-none peer-checked:text-base peer-checked:font-semibold peer-checked:text-white`}
                    >
                      {matrix.unit}
                    </FormLabel>
                  </div>
                </div>
              );
            })}
          </FormItem>
        );
      }}
    />
  );
}

export default HailRadioGroup;
