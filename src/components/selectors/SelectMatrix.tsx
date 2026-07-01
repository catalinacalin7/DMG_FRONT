"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { HailMatrix, RemoveAndInstallMatrix } from "@/types/matrices";
import { Label } from "../ui/label";

type SelectMatrixProps = {
  fieldName: string;
  fieldLabel?: string;
  fieldIndex?: number;
  placeHolder?: string;
  matrices: HailMatrix[] | RemoveAndInstallMatrix[];
  disabled?: boolean;
};

function SelectMatrix({
  fieldName,
  fieldIndex,
  placeHolder,
  matrices,
  disabled,
  fieldLabel,
}: SelectMatrixProps) {
  const { control, watch } = useFormContext();

  watch();
  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormField
          control={control}
          name={fieldName}
          render={() => {
            return (
              <FormItem className="w-full">
                <Label>{fieldLabel}</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="flex h-14 w-full justify-center py-2 text-base [&>svg]:hidden">
                      <SelectValue placeholder={placeHolder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {matrices?.map((matrix) => {
                      return (
                        <SelectItem key={matrix.id} value={matrix.id}>
                          {matrix.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}
    />
  );
}
export default SelectMatrix;
