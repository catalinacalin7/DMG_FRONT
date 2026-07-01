"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import IsPaintToggle from "./IsPaintToggle";
import { Checkbox } from "@/components/ui/checkbox";

function CarPanelStatus({
  fieldName,
  carPanelStatus,
}: {
  fieldName: string;
  carPanelStatus: string;
}) {
  const t = useTranslations("CarPanelStatus");

  const { control, watch } = useFormContext();

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => {
        return (
          <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className="ml-1 flex justify-center space-y-0">
                <FormControl className="peer hidden">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={carPanelStatus === "noDamage" ? true : false}
                  />
                </FormControl>
                <FormLabel className="rounded-lg px-2 py-1 text-xs font-normal peer-data-[state=checked]:bg-blue-500 peer-data-[state=checked]:text-white md:text-sm">
                  Paint
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }}
    />
  );
}
export default CarPanelStatus;
