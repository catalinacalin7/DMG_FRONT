"use client";

import { Form } from "@/components/ui/form";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ClientSearchSelector from "./ClientSearchSelector";
import VehicleSearchSelector from "./VehicleSearchSelector";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHailMatrices } from "@/api/matrices/hail-matrix";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import SelectMatrix from "@/components/selectors/SelectMatrix";
import LoadingScreen from "@/components/LoadingScreen";
import { HailMatrix, RemoveAndInstallMatrix } from "@/types/matrices";
import { getMatrixById } from "@/api/matrices/hail-matrix";
import CarPanelStatus from "./CarPanelStatus";
import { useParams, useSearchParams } from "next/navigation";
import { Euro } from "lucide-react";
import { getAddons } from "@/api/addons/addons";
import AddOnItems from "./AddOnItems";
import { getRandIMatrices } from "@/api/matrices/rAndi-matrix";
import { getRandIMatrix } from "@/api/matrices/rAndi-matrix";
import RandIAddOn from "./RandIAddOn";
import { useToast } from "@/components/ui/use-toast";
import { hailEstimate, updateHailEstimate } from "@/api/estimates/estimates";
import type {
  CreateEstimateHail,
  EstimateHail,
} from "@/api/estimates/estimates";
import { useTranslations } from "next-intl";
import DefaultTextInput from "@/components/inputs/DefaultTextInput";
import HailQuotientSelector from "./HailQuotientSelector";
import SvgComponent from "./SvgDiv";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Panels } from "./constants/constants";

enum PanelSatus {
  damaged = "damaged",
  noDamage = "noDamage",
  change = "change",
  hOff = "hOff",
}

type Panel = {
  panel: string | undefined;
  light: string | undefined;
  medium: string | undefined;
  strong: string | undefined;
  lightQuotient: number | undefined;
  mediumQuotient: number | undefined;
  strongQuotient: number | undefined;
  panelStatus: PanelSatus;
  panelTotal: number;
  rAndI: number;
  addOns: { name: string; isPercentages: boolean; amount: number }[];
};

const hailEstimateSchema = yup.object().shape({
  clientId: yup.string().required("Client is required"),
  vehicleId: yup.string().required("Vehicle is required"),
  estimateMode: yup.string().default("standard"),
  hailMatrixId: yup.string().required("Hail matrix is required"),
  rAndImatrixId: yup.string().required("R-And-I matrix is required"),
  registrationNumber: yup.string().uppercase(),
  rate: yup.number().default(0),
  total: yup.number().required(),
  discount: yup
    .number()
    .typeError("Discount must be a number")
    .min(0, "Must be at 0 or more")
    .max(100, "Cannot be more than 100"),
  estimateHailPanel: yup.array().of(
    yup.object().shape({
      panel: yup.string().required("This field is required."),
      light: yup.string(),
      medium: yup.string(),
      strong: yup.string(),
      lightQuotient: yup.number(),
      mediumQuotient: yup.number(),
      strongQuotient: yup.number(),
      panelStatus: yup
        .mixed()
        .oneOf([
          PanelSatus.damaged,
          PanelSatus.noDamage,
          PanelSatus.change,
          PanelSatus.hOff,
        ]),
      panelTotal: yup.number(),
      isRandI: yup.boolean(),
      rAndI: yup.number(),
      addOns: yup.array().of(
        yup.object().shape({
          name: yup.string(),
          isPercentages: yup.boolean(),
          amount: yup.number(),
        }),
      ),
    }),
  ),
});

const defaultFormValues = {
  clientId: "",
  vehicleId: "",
  estimateMode: "standard",
  hailMatrixId: "",
  rAndImatrixId: "",
  registrationNumber: "",
  rate: 0,
  total: 0,
  discount: 0,
  estimateHailPanel: Panels.map((panel, index) => ({
    panel: panel,
    light: "",
    medium: "",
    strong: "",
    lightQuotient: 0,
    mediumQuotient: 0,
    strongQuotient: 0,
    panelStatus: "noDamage",
    panelTotal: 0,
    isRandI: false,
    rAndI: 0,
    addOns: [],
  })),
} as const;

type HailEstimateFormValues = yup.InferType<typeof hailEstimateSchema>;

const HailEstimateForm = ({
  estimateHail,
}: {
  estimateHail?: EstimateHail;
}) => {
  const t = useTranslations("PageEstimates");
  const tUI = useTranslations("ui");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { id } = useParams();

  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [rAndIMatrixAddOn, setRAndIMatrixAddOn] =
    useState<RemoveAndInstallMatrix | null>(null);

  const { data: hailMatrices, isLoading: isLoadingHailMatrices } = useQuery({
    queryKey: [QUERY_KEYS.hailMatrices],
    queryFn: () => getHailMatrices(),
  });

  const { data: rAndiMatrices, isLoading: isLoadingRandIMatrices } = useQuery({
    queryKey: [QUERY_KEYS.rAndiMatrices],
    queryFn: () => getRandIMatrices(),
  });

  const { data: addOns } = useQuery({
    queryKey: ["addons", { isOn: true }],
    queryFn: ({ queryKey }: { queryKey: [string, { isOn: boolean }] }) => {
      const [, { isOn }] = queryKey;
      return getAddons(isOn);
    },
  });

  const form = useForm<HailEstimateFormValues>({
    values: estimateHail ?? defaultFormValues,
    resolver: yupResolver(hailEstimateSchema),
    shouldUnregister: false,
  });

  const vehicleId = form.watch("vehicleId");
  const hailMatrixId = form.watch("hailMatrixId");
  const rAndImatrixId = form.watch("rAndImatrixId");
  const discount = form.watch("discount");

  const { data: hailMatrix } = useQuery({
    queryKey: [QUERY_KEYS.hailMatrix, hailMatrixId],
    queryFn: () => getMatrixById(hailMatrixId as string),
    enabled: !!hailMatrixId,
  });

  const { data: rAndiMatrix } = useQuery({
    queryKey: [QUERY_KEYS.rAndiMatrix, rAndImatrixId],
    queryFn: () => getRandIMatrix(rAndImatrixId as string),
    enabled: !!rAndImatrixId,
  });

  const { fields: estimateHailPanel, update } = useFieldArray({
    control: form.control,
    name: "estimateHailPanel",
  });

  useEffect(() => {
    if (rAndiMatrix) {
      setRAndIMatrixAddOn(rAndiMatrix);
    }
  }, [rAndiMatrix]);

  useEffect(() => {
    if (hailMatrix) {
      form.setValue("rate", hailMatrix.rate);
    }
  }, [hailMatrix, form]);

  const panels = form.watch("estimateHailPanel") as Panel[];
  const rate = form.watch("rate") as number;

  const total = panels?.reduce((acc: number, item: Panel) => {
    if (!!item.addOns) {
      let sum: number =
        (Number(item.lightQuotient) / 100) * Number(rate) +
        (Number(item.mediumQuotient) / 100) * Number(rate) +
        (Number(item.strongQuotient) / 100) * Number(rate) +
        Number(item.rAndI);
      item.addOns.forEach((addOn) => {
        if (addOn.isPercentages) {
          sum *= addOn.amount / 100 + 1;
        } else {
          sum += addOn.amount;
        }
        return sum;
      });
      return acc + sum;
    }
    const totalPanel =
      (Number(item.lightQuotient) / 100) * Number(rate) +
      (Number(item.mediumQuotient) / 100) * Number(rate) +
      (Number(item.strongQuotient) / 100) * Number(rate) +
      Number(item.rAndI);

    return acc + totalPanel;
  }, 0);

  const totalHailPrice = !!total ? total.toFixed(2) : 0;

  const panelTotal = useMemo(
    () => (item: Panel) => {
      let sum: number;
      if (item.addOns.length > 0) {
        sum =
          (Number(item.lightQuotient) / 100) * Number(rate) +
          (Number(item.mediumQuotient) / 100) * Number(rate) +
          (Number(item.strongQuotient) / 100) * Number(rate) +
          Number(item.rAndI);
        item.addOns.forEach((addOn) => {
          if (addOn.isPercentages) {
            sum *= addOn.amount / 100 + 1;
          } else {
            sum += addOn.amount;
          }
        });
      } else {
        sum =
          (Number(item.lightQuotient) / 100) * Number(rate) +
          (Number(item.mediumQuotient) / 100) * Number(rate) +
          (Number(item.strongQuotient) / 100) * Number(rate) +
          Number(item.rAndI);
      }

      return sum;
    },
    [rate],
  );

  const panel0 = panelTotal(panels[0]);
  useEffect(() => {
    if (panel0) {
      form.setValue(
        `estimateHailPanel.0.panelTotal`,
        Number(panel0.toFixed(2)) * 100,
      );
    }
  }, [panel0, form]);
  const panel1 = panelTotal(panels[1]);
  useEffect(() => {
    if (panel1) {
      form.setValue(
        `estimateHailPanel.1.panelTotal`,
        Number(panel1.toFixed(2)) * 100,
      );
    }
  }, [panel1, form]);
  const panel2 = panelTotal(panels[2]);
  useEffect(() => {
    if (panel2) {
      form.setValue(
        `estimateHailPanel.2.panelTotal`,
        Number(panel2.toFixed(2)) * 100,
      );
    }
  }, [panel2, form]);
  const panel3 = panelTotal(panels[3]);
  useEffect(() => {
    if (panel3) {
      form.setValue(
        `estimateHailPanel.3.panelTotal`,
        Number(panel3.toFixed(2)) * 100,
      );
    }
  }, [panel3, form]);
  const panel4 = panelTotal(panels[4]);
  useEffect(() => {
    if (panel4) {
      form.setValue(
        `estimateHailPanel.4.panelTotal`,
        Number(panel4.toFixed(2)) * 100,
      );
    }
  }, [panel4, form]);
  const panel5 = panelTotal(panels[5]);
  useEffect(() => {
    if (panel5) {
      form.setValue(
        `estimateHailPanel.5.panelTotal`,
        Number(panel5.toFixed(2)) * 100,
      );
    }
  }, [panel5, form]);
  const panel6 = panelTotal(panels[6]);
  useEffect(() => {
    if (panel6) {
      form.setValue(
        `estimateHailPanel.6.panelTotal`,
        Number(panel6.toFixed(2)) * 100,
      );
    }
  }, [panel6, form]);
  const panel7 = panelTotal(panels[7]);
  useEffect(() => {
    if (panel7) {
      form.setValue(
        `estimateHailPanel.7.panelTotal`,
        Number(panel7.toFixed(2)) * 100,
      );
    }
  }, [panel7, form]);
  const panel8 = panelTotal(panels[8]);
  useEffect(() => {
    if (panel8) {
      form.setValue(
        `estimateHailPanel.8.panelTotal`,
        Number(panel8.toFixed(2)) * 100,
      );
    }
  }, [panel8, form]);
  const panel9 = panelTotal(panels[9]);
  useEffect(() => {
    if (panel9) {
      form.setValue(
        `estimateHailPanel.9.panelTotal`,
        Number(panel9.toFixed(2)) * 100,
      );
    }
  }, [panel9, form]);
  const panel10 = panelTotal(panels[10]);
  useEffect(() => {
    if (panel10) {
      form.setValue(
        `estimateHailPanel.10.panelTotal`,
        Number(panel10.toFixed(2)) * 100,
      );
    }
  }, [panel10, form]);
  const panel11 = panelTotal(panels[11]);
  useEffect(() => {
    if (panel11) {
      form.setValue(
        `estimateHailPanel.11.panelTotal`,
        Number(panel11.toFixed(2)) * 100,
      );
    }
  }, [panel11, form]);
  const panel12 = panelTotal(panels[12]);
  useEffect(() => {
    if (panel12) {
      form.setValue(
        `estimateHailPanel.12.panelTotal`,
        Number(panel12.toFixed(2)) * 100,
      );
    }
  }, [panel12, form]);
  const panel13 = panelTotal(panels[13]);
  useEffect(() => {
    if (panel13) {
      form.setValue(
        `estimateHailPanel.13.panelTotal`,
        Number(panel13.toFixed(2)) * 100,
      );
    }
  }, [panel13, form]);

  useEffect(() => {
    if (total) {
      form.setValue("total", Number(total.toFixed(2)) * 100);
    }
  }, [total, form]);

  const createHailEstimate = useMutation({
    mutationFn: async (formData: CreateEstimateHail) => {
      await hailEstimate(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.createHailEstimate],
      });
      toast({
        title: t("hailEstimate"),
        description: t("newHailEstimateHasBeenCreated"),
      });
      router.push("/estimates");
    },
    onError: (error) => {
      let errorStatusCode = 0;
      if ("statusCode" in error) {
        errorStatusCode = error.statusCode as number;
      }
      toast({
        title: t("hailEstimate"),
        description:
          errorStatusCode === 404
            ? t("companyNotFoundError")
            : t("thereWasAProblemWithYourRequest"),
        variant: "destructive",
      });
    },
  });

  const hailEstimateUpdate = useMutation({
    mutationFn: async (formData: CreateEstimateHail) => {
      await updateHailEstimate(formData, id as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.updateHailEstimate, id],
      });
      toast({
        title: t("hailEstimate"),
        description: t("estimateStatusHasBeenUpdated"),
      });
      router.push("/estimates");
    },
    onError: () => {
      toast({
        title: t("hailEstimate"),
        description: t("thereWasAProblemWithYourRequest"),
        variant: "destructive",
      });
    },
  });

  const handlePathClick = (pathId: string) => {
    setOpenItem((prev) => {
      if (prev === pathId) {
        return undefined;
      }
      return pathId;
    });
  };

  useEffect(() => {
    const clientId = searchParams.get("clientId");
    const vehicleId = searchParams.get("vehicleId");
    if (clientId) {
      form.setValue("clientId", clientId);
    }

    if (vehicleId) {
      form.setValue("vehicleId", vehicleId);
    }
    router.replace({ pathname });
  }, [searchParams, form, pathname, router]);

  if (isLoadingHailMatrices) return <LoadingScreen />;
  const isPending =
    createHailEstimate.isPending || hailEstimateUpdate.isPending;

  return (
    <div className="pt-4">
      <div>
        <div className="flex gap-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((formData) => {
                if (!!id) {
                  return hailEstimateUpdate.mutate(formData as any);
                } else {
                  return createHailEstimate.mutate(formData as any, {
                    onSuccess: () => {
                      form.reset();
                    },
                  });
                }
              })}
              className="w-full"
            >
              <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <ClientSearchSelector />

                <VehicleSearchSelector />

                <SelectMatrix
                  fieldName="hailMatrixId"
                  fieldLabel={t("hailMatrix")}
                  placeHolder={tUI("placeholders.selectHailMatrix")}
                  matrices={hailMatrices as HailMatrix[]}
                  disabled={!vehicleId}
                />

                <SelectMatrix
                  fieldName="rAndImatrixId"
                  fieldLabel={t("rAndIMatrix")}
                  placeHolder={tUI("placeholders.selectRAndIMatrix")}
                  matrices={rAndiMatrices as RemoveAndInstallMatrix[]}
                  disabled={!hailMatrixId}
                />

                <DefaultTextInput
                  fieldName="registrationNumber"
                  fieldLabel={t("registrationNumber")}
                  isTextUpperCase={true}
                />
              </div>
              <div className="flex items-center justify-end py-10 text-2xl">
                <div className="flex items-center justify-center gap-1">
                  <p> {t("total")} = </p>
                  <div className="flex items-center justify-center">
                    <Euro size={22} /> {totalHailPrice}
                  </div>
                </div>
              </div>
              <div
                className={`flex items-center justify-center ${!rAndImatrixId ? "pointer-events-none" : ""}`}
              >
                <SvgComponent onPathClick={handlePathClick} tag={openItem} />
              </div>
              <div>
                {estimateHailPanel.map((panel, index) => {
                  const panelName = form.watch(
                    `estimateHailPanel.${index}.panel`,
                  );
                  if (panelName !== panel.panel) return null;
                  return (
                    <div
                      key={index}
                      className={`${openItem === panel.panel ? "block" : "hidden"} `}
                    >
                      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                        <CarPanelStatus
                          fieldName={`estimateHailPanel.${index}.panelStatus`}
                          disabled={!rAndImatrixId}
                          onNoDamagePanel={() => {
                            return update(index, {
                              panel: panel.panel,
                              light: "",
                              medium: "",
                              strong: "",
                              lightQuotient: 0,
                              mediumQuotient: 0,
                              strongQuotient: 0,
                              panelStatus: PanelSatus.noDamage,
                              panelTotal: 0,
                              rAndI: 0,
                              addOns: [],
                            });
                          }}
                          onHandsOfPanel={() => {
                            return update(index, {
                              panel: panel.panel,
                              light: "",
                              medium: "",
                              strong: "",
                              lightQuotient: 0,
                              mediumQuotient: 0,
                              strongQuotient: 0,
                              panelStatus: PanelSatus.hOff,
                              panelTotal: 0,
                              rAndI: 0,
                              addOns: [],
                            });
                          }}
                          onChangePanel={() =>
                            update(index, {
                              panel: panel.panel,
                              light: "",
                              medium: "",
                              strong: "",
                              lightQuotient: 0,
                              mediumQuotient: 0,
                              strongQuotient: 0,
                              panelStatus: PanelSatus.change,
                              panelTotal: 0,
                              rAndI: 0,
                              addOns: [],
                            })
                          }
                        />
                      </div>

                      <div
                        className={`${form.watch(`estimateHailPanel.${index}.panelStatus`) === PanelSatus.damaged ? "block" : "hidden"} `}
                      >
                        <h3 className="font-semibold">{t(panel.panel)}</h3>
                        <div className="grid w-full grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-2">
                              <div>{t("lightDamage")}(0-20mm)</div>
                              <div className="text-blue-300">
                                {!!form.watch(
                                  `estimateHailPanel.${index}.lightQuotient`,
                                ) && (
                                  <div>
                                    <span>
                                      {Number(
                                        form.watch(
                                          `estimateHailPanel.${index}.lightQuotient`,
                                        ),
                                      ) / 100}{" "}
                                      &#215; {rate}
                                    </span>{" "}
                                    ={" "}
                                    <span>
                                      {(Number(
                                        form.watch(
                                          `estimateHailPanel.${index}.lightQuotient`,
                                        ),
                                      ) *
                                        rate) /
                                        100}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <HailQuotientSelector
                                fieldName={`estimateHailPanel.${index}.light`}
                                fieldId={`estimateHailPanel.${index}.light`}
                                quotient={`estimateHailPanel.${index}.lightQuotient`}
                                damageLevel="light"
                                matrix={hailMatrix as HailMatrix}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-2">
                              <div>{t("mediumDamage")}(21-31mm)</div>
                              <div className="text-blue-300">
                                {!!form.watch(
                                  `estimateHailPanel.${index}.mediumQuotient`,
                                ) && (
                                  <div>
                                    <span>
                                      {Number(
                                        form.watch(
                                          `estimateHailPanel.${index}.mediumQuotient`,
                                        ),
                                      ) / 100}{" "}
                                      &#215; {rate}
                                    </span>{" "}
                                    ={" "}
                                    <span>
                                      {(Number(
                                        form.watch(
                                          `estimateHailPanel.${index}.mediumQuotient`,
                                        ),
                                      ) *
                                        rate) /
                                        100}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <HailQuotientSelector
                              fieldName={`estimateHailPanel.${index}.medium`}
                              fieldId={`estimateHailPanel.${index}.medium`}
                              quotient={`estimateHailPanel.${index}.mediumQuotient`}
                              damageLevel="medium"
                              matrix={hailMatrix as HailMatrix}
                            />
                          </div>
                          <div>
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-2">
                              <div>{t("strongDamage")}(32-45mm)</div>
                              <div className="text-blue-300">
                                {!!form.watch(
                                  `estimateHailPanel.${index}.strongQuotient`,
                                ) && (
                                  <div>
                                    <span>
                                      {Number(
                                        form.watch(
                                          `estimateHailPanel.${index}.strongQuotient`,
                                        ),
                                      ) / 100}{" "}
                                      &#215; {rate}
                                    </span>{" "}
                                    ={" "}
                                    <span>
                                      {(Number(
                                        form.watch(
                                          `estimateHailPanel.${index}.strongQuotient`,
                                        ),
                                      ) *
                                        rate) /
                                        100}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <HailQuotientSelector
                              fieldName={`estimateHailPanel.${index}.strong`}
                              fieldId={`estimateHailPanel.${index}.strong`}
                              quotient={`estimateHailPanel.${index}.strongQuotient`}
                              damageLevel="strong"
                              matrix={hailMatrix as HailMatrix}
                            />
                          </div>
                        </div>
                        <div>
                          <div>
                            <h3 className="py-1 text-lg font-semibold">
                              {t("rAndI")}
                            </h3>
                            <div className="py-1">
                              <RandIAddOn
                                fieldName={`estimateHailPanel.${index}.isRandI`}
                                rAndIformField={`estimateHailPanel.${index}.rAndI`}
                                rAndI={
                                  rAndIMatrixAddOn as RemoveAndInstallMatrix
                                }
                                panelName={panel.panel}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          {addOns && addOns?.length > 0 && (
                            <div>
                              <h3 className="py-1 text-lg font-semibold">
                                {t("addOns")}
                              </h3>
                              <div className="py-1">
                                <AddOnItems
                                  addOnItems={addOns}
                                  fieldIndex={index}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 py-4">
                <Button
                  type="button"
                  size="lg"
                  variant={"secondary"}
                  onClick={() => {
                    router.push("/estimates");
                  }}
                >
                  {tUI("buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending || form.formState.isSubmitting}
                >
                  {tUI("buttons.save")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default HailEstimateForm;
