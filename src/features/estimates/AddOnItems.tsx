"use client";

import AddOnSwitch from "@/components/switches/AddOnSwitch";
import SwitchComp from "@/components/switches/SwitchComp";
import { AddOnsType } from "@/types/add-ons";
import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext } from "react-hook-form";

function AddOnItems({
  fieldIndex,
  addOnItems,
}: {
  fieldIndex: number;
  addOnItems: AddOnsType[];
}) {
  const t = useTranslations("Settings.AddOns");
  const { control, watch } = useFormContext();
  const {
    fields: children,
    append,
    remove,
  } = useFieldArray({
    control: control,
    name: `estimateHailPanel.${fieldIndex}.addOns`,
  });

  const addOns = watch(`estimateHailPanel.${fieldIndex}.addOns`) || [];

  return (
    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {addOnItems.map((addOn, index) => {
        const existingIndex = addOns.findIndex(
          (child) => "name" in child && child.name === addOn.name,
        );
        const isAdded = existingIndex !== -1;
        return (
          <div key={`${addOn.id} - ${fieldIndex}`} className="w-full">
            <AddOnSwitch
              fieldName={`estimateHailPanel.${fieldIndex}.addOns.${addOn.name}`}
              fieldLabel={t(addOn.name)}
              isChecked={isAdded}
              onAppend={() => {
                if (!isAdded)
                  append({
                    name: addOn.name,
                    isPercentages: addOn.isPercentages,
                    amount: addOn.amount,
                  });
              }}
              onRemove={() => {
                if (isAdded) remove(existingIndex);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
export default AddOnItems;
