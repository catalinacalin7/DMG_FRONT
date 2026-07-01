"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Switch } from "../ui/switch";

type AddOnSwitchProps = {
  fieldName: string;
  fieldLabel?: string;
  isChecked: boolean;
  onAppend: () => void;
  onRemove: () => void;
};

function AddOnSwitch({
  fieldName,
  fieldLabel,
  isChecked,
  onAppend,
  onRemove,
}: AddOnSwitchProps) {
  const { control, watch } = useFormContext();

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={!!isChecked}
            onCheckedChange={(value) => {
              field.onChange(value);
              value ? onAppend() : onRemove();
            }}
          />
          <span className="text-sm">{fieldLabel}</span>
        </div>
      )}
    />
  );
}
export default AddOnSwitch;
