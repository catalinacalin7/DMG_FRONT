import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

type CheckboxInputProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  disabled?: boolean | undefined;
  labelPosition?: "top" | "left";
};

const CheckboxInput = ({
  fieldName,
  fieldLabel,
  disabled,
  labelPosition,
}: CheckboxInputProps) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem
            className={`grid grid-cols-1 place-items-start justify-items-start gap-0 ${labelPosition === "top" ? "" : "lg:grid-cols-2 lg:gap-4 xl:grid-cols-3"}`}
          >
            <FormLabel className="text-nowrap text-base lg:pr-14">
              {fieldLabel}
            </FormLabel>

            <div className="flex flex-col gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
};

export default CheckboxInput;
