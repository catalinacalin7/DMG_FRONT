import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Controller, useFormContext } from "react-hook-form";

type RandISwitchProps = {
  fieldName: string;
  rAndIformField: string;
  fieldLable?: string;
  fieldDescription?: string;
  fieldIndex?: number;
  value: number;
};

function RandISwitch({
  fieldName,
  rAndIformField,
  fieldLable,
  fieldDescription,
  value,
}: RandISwitchProps) {
  const { control, watch, setValue } = useFormContext();
  watch();
  return (
    <div>
      <Controller
        control={control}
        name={fieldName}
        render={({ field }) => {
          return (
            <FormItem className="flex items-center justify-start gap-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      setValue(rAndIformField, value);
                    } else {
                      setValue(rAndIformField, "");
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel className="text-nowrap">{fieldLable}</FormLabel>
                <FormDescription>{fieldDescription}</FormDescription>
              </div>
            </FormItem>
          );
        }}
      />
    </div>
  );
}
export default RandISwitch;
