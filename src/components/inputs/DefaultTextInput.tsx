import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

type DefaultTextInputProps = {
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
  disabled?: boolean | undefined;
  isTextUpperCase?: boolean;
};

function DefaultTextInput({
  fieldName,
  fieldLabel,
  required,
  placeholder,
  type,
  withButton,
  disabled,
  isTextUpperCase,
}: DefaultTextInputProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={fieldName}
      defaultValue={""}
      render={({ field }) => {
        return (
          <FormItem className="w-full gap-0">
            <FormLabel className="text-base">{fieldLabel}</FormLabel>

            <div className="w-full">
              <div className="flex gap-2">
                <FormControl className="w-full">
                  <Input
                    disabled={disabled}
                    placeholder={placeholder}
                    type={type}
                    {...field}
                    className={`${isTextUpperCase ? "uppercase" : ""} h-10`}
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
export default DefaultTextInput;
