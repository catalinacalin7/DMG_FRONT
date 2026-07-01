"use client";

import HailInput from "@/components/inputs/HailInput";
import NumericFormatInput from "@/components/inputs/NumericFormatInput";
import NumericInput from "@/components/inputs/NumericInput";
import PercentageSlider from "@/components/sliders/PercentageSlider";
import AddOnSwitch from "@/components/switches/AddOnSwitch";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AddOnsType } from "@/types/add-ons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

function AddOns({
  nestedIndex,
  addOnName,
  addOnIndex,
  isAdded,
}: {
  nestedIndex: number;
  addOnName: string;
  addOnIndex: number;
  isAdded: boolean;
}) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const t = useTranslations("Settings.AddOns");
  const { control, watch, setValue } = useFormContext();
  const {
    fields: children,
    append,
    remove,
  } = useFieldArray({
    control: control,
    name: `estimateHailPanel.${nestedIndex}.addOns`,
  });
  const isOn =
    watch(`estimateHailPanel.${nestedIndex}.addOns.${addOnIndex}.amount`) > 0
      ? true
      : false;

  return (
    // <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    <div key={`${addOnName} - ${nestedIndex}`}>
      <div className="w-full py-2">
        <h3 className="py-1 capitalize">{addOnName}</h3>
        <Switch
          name={`estimateHailPanel.${nestedIndex}.addOns.${addOnName}`}
          checked={isAdded}
          onCheckedChange={() => {
            setIsActive((value) => !value);
            if (!isAdded) {
              append({
                name: addOnName,
                isPercentages: false,
                amount: 0,
              });
            } else {
              remove(addOnIndex);
            }
          }}
        />
      </div>

      <div>
        {children.map((addOnItem, index) => {
          const isPercentageSelected = watch(
            `estimateHailPanel.${nestedIndex}.addOns.${index}.isPercentages`,
          );
          const name = watch(
            `estimateHailPanel.${nestedIndex}.addOns.${index}.name`,
          );

          const amount = watch(
            `estimateHailPanel.${nestedIndex}.addOns.${index}.amount`,
          );

          if (name !== addOnName) return null;

          return (
            <div
              key={addOnItem.id}
              className="flex flex-col rounded-lg border p-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex w-full flex-col items-center justify-start sm:flex-row">
                    <div className="flex gap-2 rounded-lg border p-1">
                      <Button
                        type="button"
                        variant={isPercentageSelected ? "default" : "secondary"}
                        size="sm"
                        onClick={() => {
                          setValue(
                            `estimateHailPanel.${nestedIndex}.addOns.${index}.isPercentages`,
                            true,
                          );
                          setValue(
                            `estimateHailPanel.${nestedIndex}.addOns.${index}.amount`,
                            0,
                          );
                        }}
                      >
                        <span className="text-xs">{t("percentages")}</span>
                      </Button>
                      <Button
                        type="button"
                        variant={
                          !isPercentageSelected ? "default" : "secondary"
                        }
                        size="sm"
                        onClick={() => {
                          setValue(
                            `estimateHailPanel.${nestedIndex}.addOns.${index}.isPercentages`,
                            false,
                          );
                          setValue(
                            `estimateHailPanel.${nestedIndex}.addOns.${index}.amount`,
                            0,
                          );
                        }}
                      >
                        <span className="text-xs">{t("fixedPrice")}</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="w-full py-4">
                  {isPercentageSelected ? (
                    <div>
                      <div className="mb-2 flex justify-between">
                        <p className="font-medium text-slate-700">
                          {t("amount")} %
                        </p>
                      </div>
                      <HailInput
                        fieldName={`estimateHailPanel.${nestedIndex}.addOns.${index}.amount`}
                        type="number"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2 flex justify-between">
                        <p className="font-medium text-slate-700">
                          {t("amount")} fixed
                        </p>
                      </div>
                      <HailInput
                        fieldName={`estimateHailPanel.${nestedIndex}.addOns.${index}.amount`}
                        type="number"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default AddOns;
