import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useFormContext } from "react-hook-form";
type TextareaInputProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  required?: boolean | undefined;
  placeholder?: string | undefined;
  multiline?: boolean | undefined;
  rows?: number | undefined;
  minRows?: number | undefined;
  maxRows?: number | undefined;
  type?: string;
  labelPosition?: "top" | "left";
};

const TextareaInput = ({
  fieldName,
  fieldLabel,
  required,
  placeholder,
  multiline,
  rows,
  minRows,
  maxRows,
  type,
  labelPosition,
}: TextareaInputProps) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      key={fieldName}
      name={fieldName}
      render={({ field }) => (
        <FormItem
          className={`grid grid-cols-1 place-items-start justify-items-start gap-0 ${labelPosition === "top" ? "" : "lg:grid-cols-2 lg:gap-4 xl:grid-cols-3"}`}
        >
          <FormLabel className="text-nowrap text-base lg:pr-14">
            {fieldLabel}
          </FormLabel>

          <div className="w-full">
            <FormControl className="w-full">
              <Textarea placeholder="" className="resize-none" {...field} />
            </FormControl>
            <FormMessage className="text-red-500" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TextareaInput;
