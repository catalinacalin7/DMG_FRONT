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

type AddOnsSwitchProps = {
  fieldName: string;
  panelId: string;
  fieldLabel?: string;
  fieldDescription?: string;
  rAndIID: string;
  fieldIndex?: number;
  value?: number;
};

function AddOnsSwitch({
  fieldName,
  panelId,
  fieldLabel,
  fieldDescription,
  rAndIID,
  value,
}: AddOnsSwitchProps) {
  const { control, watch, setValue } = useFormContext();
  const fieldValue = watch(fieldName);
  const key = `${fieldName}-${panelId}`;
  watch();
  return (
    <div>
      <Controller
        key={key}
        control={control}
        name={fieldName}
        render={({ field }) => {
          return (
            <FormItem className="flex items-center justify-start gap-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    if (!value) {
                      setValue(`${rAndIID}`, 0);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          );
        }}
      />
    </div>
  );
}
export default AddOnsSwitch;
