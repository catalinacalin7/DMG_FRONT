import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

type RadioGroupInputProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  required?: boolean | undefined;
  options: { label: string; value: string }[];
};

const RadioGroupInput = ({
  fieldName,
  fieldLabel,
  required,
  options,
}: RadioGroupInputProps) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field, formState }) => (
        <FormItem className="grid grid-cols-1 place-items-start justify-items-start lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
          <Label className="text-nowrap text-[16px] font-semibold lg:pr-14">
            {fieldLabel}
          </Label>
          <FormControl>
            <RadioGroup
              name={fieldLabel}
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="gap-3"
            >
              {options.map((item) => {
                return (
                  <FormItem key={item.value}>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-start gap-2">
                        <FormControl>
                          <RadioGroupItem
                            value={item.value}
                            id={item.value}
                            className={
                              !!formState.errors.role
                                ? "border-red-500 text-red-500"
                                : ""
                            }
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={item.value}
                          className="text-sm font-medium text-black"
                        >
                          {item.label}
                        </FormLabel>
                      </div>
                    </div>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RadioGroupInput;
