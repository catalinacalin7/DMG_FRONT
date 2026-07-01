"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller, useFormContext } from "react-hook-form";

type CheckboxLabelProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  onAppend: () => void;
  onRemove: () => void;
  items: string[];
  disabled?: boolean | undefined;
};

const CheckboxLabel = ({
  fieldName,
  fieldLabel,
  onAppend,
  onRemove,
  items,
  disabled,
}: CheckboxLabelProps) => {
  const { control, watch } = useFormContext();
  const existingComment = (comment: string) => {
    const currentComment = watch(fieldName) as Record<string, string>[];
    const index = currentComment?.findIndex((t) => t.comment === comment);
    return index;
  };
  console.log(fieldName);
  return (
    <Controller
      control={control}
      name={fieldName}
      render={() => {
        return (
          <FormField
            control={control}
            name={fieldName}
            render={({ field }) => {
              return (
                <div>
                  {items.map((item) => (
                    <FormItem className="flex w-full" key={item}>
                      <div className="flex w-full flex-col gap-2">
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer text-nowrap rounded-md px-3 py-1 capitalize transition-colors hover:bg-gray-100 peer-checked:bg-gray-600 peer-checked:text-white">
                            {item}
                          </FormLabel>
                        </div>
                        <FormControl className="">
                          <Checkbox
                            id={item}
                            checked={existingComment(field.value) !== -1}
                            onCheckedChange={(checked) => {
                              console.log(field.value);
                              if (checked === true) {
                                onAppend();
                              } else {
                                onRemove();
                              }
                              field.onChange(!!checked);
                            }}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  ))}
                </div>
              );
            }}
          />
        );
      }}
    />
  );
};

export default CheckboxLabel;
