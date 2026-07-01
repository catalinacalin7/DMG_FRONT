import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Controller, useFormContext } from "react-hook-form";
import { Slider } from "../ui/slider";

type PercentageSliderProps = {
  fieldName: string;
  fieldLabel?: string;
  fieldDescription?: string;
};

function PercentageSlider({ fieldName, fieldLabel }: PercentageSliderProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormField
            control={control}
            name={fieldName}
            render={() => {
              return (
                <div className="flex flex-col gap-2">
                  <FormLabel>{fieldLabel}</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      onValueChange={field.onChange}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              );
            }}
          />
        );
      }}
    />
  );
}
export default PercentageSlider;
