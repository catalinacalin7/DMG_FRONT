import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Controller, useFormContext } from "react-hook-form";

type SwitchCompProps = {
  fieldName: string;
  fieldLable?: string;
  fieldDescription?: string;
  fieldIndex?: number;
  onAppendAddOn?: () => void;
};

function SwitchComp({
  fieldName,
  fieldLable,
  fieldDescription,
  onAppendAddOn,
}: SwitchCompProps) {
  const { control, watch, setValue } = useFormContext();
  watch();
  return (
    <div>
      <Controller
        control={control}
        name={fieldName}
        key={fieldName}
        render={({ field }) => {
          return (
            <FormItem className="flex items-center justify-start gap-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    if (onAppendAddOn) {
                      onAppendAddOn();
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
export default SwitchComp;
