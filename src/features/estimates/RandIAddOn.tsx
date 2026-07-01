"use client";

import RandISwitch from "@/components/switches/RandISwitch";
import SwitchComp from "@/components/switches/SwitchComp";
import { AddOnsType } from "@/types/add-ons";
import { RemoveAndInstallMatrix } from "@/types/matrices";
import { useFieldArray, useFormContext } from "react-hook-form";

function RandIAddOn({
  fieldName,
  rAndIformField,
  fieldIndex,
  rAndI,
  panelName,
}: {
  fieldName: string;
  rAndIformField: string;
  fieldIndex?: number;
  rAndI: RemoveAndInstallMatrix;
  panelName: string;
}) {
  const panelRandI =
    rAndI &&
    (Object.keys(rAndI).find(
      (key) => panelName.replace(/\s/g, "").toLowerCase() === key.toLowerCase(),
    ) as string);
  const value = panelRandI ? rAndI[panelRandI] : undefined;

  return (
    <div className="w-full">
      <RandISwitch
        fieldName={fieldName}
        rAndIformField={rAndIformField}
        value={value}
      />
    </div>
  );
}
export default RandIAddOn;
