"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";

type PanelLabel = { label: string };

const PANEL_COMMENT = [
  { label: "repaintedPanel" },
  { label: "riskPaintPeeling" },
  { label: "technicalDifficulty" },
  { label: "crackedPaint" },
  { label: "outsideInsuranceClaim" },
  { label: "technicalLimitation" },
];

type EstimatePanelLabelProps = {
  fieldName: string;
};

function EstimatePanelLabel({ fieldName }: EstimatePanelLabelProps) {
  const t = useTranslations("PageEstimates");

  const { control, watch } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => {
          const selected: PanelLabel[] = field.value || [];
          return (
            <div className="flex flex-col gap-2">
              {PANEL_COMMENT.map((item) => {
                const checked = selected.some((s) => s.label === item.label);
                return (
                  <label
                    key={item.label}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      className="hidden"
                      checked={checked}
                      onCheckedChange={(val) => {
                        let next: PanelLabel[];
                        if (val) {
                          next = [...selected, item];
                        } else {
                          next = selected.filter((s) => s.label !== item.label);
                        }
                        field.onChange(next);
                      }}
                    />
                    <span
                      className={`select-none rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-100 lg:text-base ${
                        checked ? "bg-gray-300" : ""
                      }`}
                    >
                      {t(item.label)}
                    </span>
                  </label>
                );
              })}
            </div>
          );
        }}
      />
    </div>
  );
}
export default EstimatePanelLabel;
