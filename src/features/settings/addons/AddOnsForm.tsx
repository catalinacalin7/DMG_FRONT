"use client";

import { saveAddons, getAddons } from "@/api/addons/addons";
import NumericFormatInput from "@/components/inputs/NumericFormatInput";
import LoadingScreen from "@/components/LoadingScreen";
import PercentageSlider from "@/components/sliders/PercentageSlider";
import SwitchComp from "@/components/switches/SwitchComp";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { AddOnsType } from "@/types/add-ons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

export const AddOns = [
  "aluminium",
  "hss",
  "doublePanels",
  "gluePull",
  "limitedAccess",
  "tallVehicle",
  "xlPanel",
  "ribbedRoof",
  "sharpDeepDents",
  "soundDeadening",
  "laminatedGlass",
  "heatInductionRequired",
  "pushToRepair",
  "doubleOsDents",
  "bodylineDents",
  "edgeOfPanelDents",
  "extremeOsDents",
  "heatInductionDents",
  "stretchedMetalDents",
  "paint",
];

const MatrixAddOnsSchema = yup.object().shape({
  addOns: yup.array().of(
    yup.object().shape({
      name: yup.string().required("This field is required."),
      isPercentages: yup.boolean(),
      isOn: yup.boolean(),
      amount: yup.number().when("isOn", {
        is: true,
        then: (schema) =>
          schema.test(
            "value-not-zero",
            "Value must be greater than 0",
            (value) => {
              if (value === 0) {
                return false;
              }
              return true;
            },
          ),
      }),
    }),
  ),
});

const defaultFormValues = {
  addOns: AddOns.map((addOn) => ({
    name: addOn,
    isPercentages: true,
    isOn: false,
    amount: 0,
  })),
} as const;

function AddOnsForm() {
  const t = useTranslations("Settings.AddOns");
  const tNav = useTranslations("Navigation");
  const tUI = useTranslations("ui");
  const queryClient = useQueryClient();
  const tActions = useTranslations("ToastActions");

  const { data, isLoading: isLoadingAddOns } = useQuery({
    queryKey: ["addons"],
    queryFn: () => getAddons(),
  });

  const addOnsData = {
    addOns: data?.map(({ name, isPercentages, isOn, amount }) => ({
      name,
      isPercentages,
      isOn,
      amount,
    })),
  };

  const form = useForm({
    values: data && data?.length > 0 ? addOnsData : defaultFormValues,
    resolver: yupResolver(MatrixAddOnsSchema),
    mode: "onChange",
  });

  const { fields: addOns, update } = useFieldArray({
    control: form.control,
    name: "addOns",
  });

  const createAddonsMutation = useMutation({
    mutationFn: async (formData: AddOnsType[]) => {
      await saveAddons(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addons"],
      });

      toast.success(tNav("addOns"), {
        description: tActions("updated"),
      });
    },
    onError: () => {
      toast.error(tNav("addOns"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const onSubmit = (values) => {
    createAddonsMutation.mutate(values.addOns);
  };

  if (isLoadingAddOns) return <LoadingScreen />;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {addOns.map((addOn, index) => {
              const isAddOnSelected = form.watch(`addOns.${index}.isOn`);
              const isPercentageSelected = form.watch(
                `addOns.${index}.isPercentages`,
              );
              const amount = form.watch(`addOns.${index}.amount`);
              return (
                <div
                  key={index}
                  className="flex flex-col justify-start rounded-lg border p-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex w-full flex-col items-center justify-start sm:flex-row">
                      <div className="flex w-full items-center justify-start gap-3">
                        <SwitchComp fieldName={`addOns.${index}.isOn`} />
                        <div className="py-2">{t(addOn.name)}</div>
                      </div>

                      {isAddOnSelected && (
                        <div className="flex gap-2 rounded-lg border p-1">
                          <Button
                            type="button"
                            variant={
                              isPercentageSelected ? "default" : "secondary"
                            }
                            size="sm"
                            onClick={() => {
                              form.setValue(
                                `addOns.${index}.isPercentages`,
                                true,
                              );
                              form.setValue(`addOns.${index}.amount`, 0);
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
                              form.setValue(
                                `addOns.${index}.isPercentages`,
                                false,
                              );
                              form.setValue(`addOns.${index}.amount`, 0);
                            }}
                          >
                            <span className="text-xs">{t("fixedPrice")}</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isAddOnSelected && (
                    <div className="w-full py-4">
                      {isPercentageSelected ? (
                        <div>
                          <div className="mb-2 flex justify-between">
                            <p className="font-medium text-slate-700">
                              {t("amount")}
                            </p>
                            <p className="font-medium text-slate-700">
                              {amount}%
                            </p>
                          </div>
                          <PercentageSlider
                            fieldName={`addOns.${index}.amount`}
                          />
                        </div>
                      ) : (
                        <div>
                          <NumericFormatInput
                            fieldName={`addOns.${index}.amount`}
                            fieldLabel={t("amount")}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 py-4">
            <Button
              type="button"
              variant={"secondary"}
              size="lg"
              onClick={() => {
                form.reset();
              }}
            >
              {tUI("buttons.cancel")}
            </Button>
            <Button size="lg" type="submit">
              {tUI("buttons.save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
export default AddOnsForm;
