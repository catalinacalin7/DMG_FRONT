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

function CarPanelStatus({
  fieldName,
  onNoDamagePanel,
  onHandsOfPanel,
  onChangePanel,
  disabled,
}: {
  fieldName: string;
  onNoDamagePanel: () => void;
  onHandsOfPanel: () => void;
  onChangePanel: () => void;
  disabled: boolean;
}) {
  const t = useTranslations("CarPanelStatus");

  const { control, watch, setValue } = useFormContext();
  const statusValue = watch(`${fieldName}`);

  const hailMatrixId = watch("hailMatrixId");
  const rAndImatrixId = watch("rAndImatrixId");

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
              <FormItem className="w-full">
                <FormControl>
                  <RadioGroup
                    disabled={disabled}
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === "noDamage") {
                        onNoDamagePanel();
                      }
                      if (value === "hOff") {
                        onHandsOfPanel();
                      }
                      if (value === "change") {
                        onChangePanel();
                      }
                    }}
                    defaultValue={field.value}
                    className="flex w-full items-center justify-between gap-0 rounded-lg border p-[2px]"
                  >
                    <FormItem className="flex items-center justify-center">
                      <FormControl className="peer hidden">
                        <RadioGroupItem value="pdr" />
                      </FormControl>
                      <FormLabel className="rounded-lg px-2 py-1 text-xs font-semibold peer-data-[state=checked]:bg-green-500 peer-data-[state=checked]:text-white md:text-xs">
                        {t("pdr")}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center justify-center">
                      <FormControl className="peer hidden">
                        <RadioGroupItem value="repairAndPaint" />
                      </FormControl>
                      <FormLabel className="rounded-lg px-2 py-1 text-xs font-semibold peer-data-[state=checked]:bg-orange-400 peer-data-[state=checked]:text-white md:text-xs">
                        {t("repairAndPaint")}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center justify-center">
                      <FormControl className="peer hidden">
                        <RadioGroupItem value="noDamage" />
                      </FormControl>
                      <FormLabel className="rounded-lg px-2 py-1 text-xs font-semibold peer-data-[state=checked]:outline peer-data-[state=checked]:outline-gray-500 md:text-xs">
                        {t("noDamage")}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl className="peer hidden">
                        <RadioGroupItem value="change" />
                      </FormControl>
                      <FormLabel className="rounded-lg px-2 py-1 text-xs font-semibold peer-data-[state=checked]:bg-sky-400 peer-data-[state=checked]:text-white md:text-sm">
                        {t("change")}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center">
                      <FormControl className="peer hidden">
                        <RadioGroupItem value="hOff" />
                      </FormControl>
                      <FormLabel className="rounded-lg px-2 py-1 text-xs font-semibold peer-data-[state=checked]:bg-gray-400 peer-data-[state=checked]:text-white md:text-sm">
                        {t("hOff")}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
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
