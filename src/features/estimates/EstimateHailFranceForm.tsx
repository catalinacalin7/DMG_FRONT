"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ClientSearchSelector from "./ClientSearchSelector";
import VehicleSearchSelector from "./VehicleSearchSelector";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import CarPanelStatus from "./CarPanelStatus";
import { useParams, useSearchParams } from "next/navigation";
import { Euro } from "lucide-react";
import { getAddons } from "@/api/addons/addons";
import { useToast } from "@/components/ui/use-toast";
import { hailEstimate, updateHailEstimate } from "@/api/estimates/estimates";
import type {
  CreateEstimateHail,
  EstimateHail,
} from "@/api/estimates/estimates";
import { useTranslations } from "next-intl";
import DefaultTextInput from "@/components/inputs/DefaultTextInput";
import SVGComponent from "./SvgDiv";
import HailInput from "@/components/inputs/HailInput";
import AddOnsSwitch from "@/components/inputs/AddOnsSwitch";
import AddOns from "./AddOns";
import { AddOnsType } from "@/types/add-ons";
import { usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import SvgButtons from "./SvgButtons";
import { getFranceMatrix } from "@/api/matrices/france-hail-matrix";
import { FranceHailMatrix } from "@/api/matrices/france-hail-matrix";
import SwitchComp from "@/components/switches/SwitchComp";
import TextInput from "@/components/inputs/TextInput";
import { getFranceRemoveInstall } from "@/api/matrices/france-remove-install";

// UT = units of time
const UT = 6;
export const Panels = [
  "hood",
  "leftFrontFender",
  "leftFrontDoor",
  "leftRocker",
  "leftRearDoor",
  "leftQuarter",
  "rightFrontFender",
  "rightFrontDoor",
  "rightRocker",
  "rightRearDoor",
  "rightQuarter",
  "roof",
  "leftRail",
  "rightRail",
  "trunk",
  "windScreenFrame",
  "cowl",
];

export enum PanelSatus {
  pdr = "pdr",
  repairAndPaint = "repairAndPaint",
  noDamage = "noDamage",
  change = "change",
  hOff = "hOff",
}

export type Panel = {
  panel: string;
  light: string;
  medium: string;
  strong: string;
  technicalDentsCount: number;
  technicalDentsCost: number;
  panelStatus: PanelSatus;
  panelTotal: number;
  isAluminium: boolean;
  isRandI: boolean;
  rAndI: number;
  addOns: { name: string; isPercentages: boolean; amount: number }[];
};

const hailEstimateSchema = yup.object().shape({
  clientId: yup.string().required("Client is required"),
  vehicleId: yup.string().required("Vehicle is required"),
  estimateMode: yup.string().default("manual"),
  registrationNumber: yup.string().uppercase(),
  removeInstall: yup
    .string()
    .required("This field is required.")
    .matches(/^\d+\.\d{2}$/, "Must be a number with two decimals.")
    .default("0"),
  total: yup.number().required(),
  discount: yup
    .number()
    .typeError("Discount must be a number")
    .min(0, "Must be at 0 or more")
    .max(100, "Cannot be more than 100"),
  estimateHailPanel: yup.array().of(
    yup.object().shape({
      panel: yup.string().required("This field is required."),
      light: yup.string().optional().typeError("Must be a number"),
      medium: yup.string().optional().typeError("Must be a number"),
      strong: yup.string().optional().typeError("Must be a number"),
      technicalDentsCount: yup.number().integer(),
      technicalDentsCost: yup.number().integer(),
      panelStatus: yup
        .mixed()
        .oneOf([
          PanelSatus.pdr,
          PanelSatus.repairAndPaint,
          PanelSatus.noDamage,
          PanelSatus.change,
          PanelSatus.hOff,
        ]),
      panelTotal: yup.number(),
      isRandI: yup.boolean(),
      isAluminium: yup.boolean(),
      rAndI: yup
        .number()
        .transform((value, originalValue) =>
          originalValue === "" ? undefined : value,
        )
        .typeError("Must be a number")
        .when("isRandI", {
          is: true,
          then: (schema) => schema.required("Required. Must be number"),
          otherwise: (schema) => schema.default(0),
        }),
      addOns: yup.array().of(
        yup.object().shape({
          name: yup.string(),
          isPercentages: yup.boolean(),
          amount: yup
            .number()
            .typeError("Must be a number")
            .when("isPercentages", {
              is: true,
              then: (schema) =>
                schema
                  .integer("Should be a number")
                  .positive("Positive number allowed")
                  .min(1, "Min 1")
                  .max(100, "Max 100")
                  .required("Percentage from 1 to 100"),
              otherwise: (schema) => schema.required("Shoud be a fixed number"),
            }),
        }),
      ),
    }),
  ),
});

const defaultFormValues = {
  clientId: "",
  vehicleId: "",
  estimateMode: "manual",
  removeInstall: "0.00",
  registrationNumber: "",
  rate: 0,
  total: 0,
  discount: 0,
  estimateHailPanel: Panels.map((panel, index) => ({
    panel: panel,
    light: "",
    medium: "",
    strong: "",
    technicalDentsCount: 0,
    technicalDentsCost: 0,
    panelStatus: "noDamage",
    panelTotal: 0,
    isAluminium: false,
    isRandI: false,
    rAndI: 0,
    addOns: [],
  })),
} as const;

type HailEstimateFormValues = yup.InferType<typeof hailEstimateSchema>;

const EstimateHailFranceForm = ({
  estimateHail,
}: {
  estimateHail?: EstimateHail;
}) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [hailRates, setHailRates] = useState<FranceHailMatrix>();
  const t = useTranslations("PageEstimates");
  const tMatrix = useTranslations("Settings.Matrix");
  const tUI = useTranslations("ui");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const viewportWidth = window.innerWidth;

  const { data: franceHailMatrix } = useQuery({
    queryKey: [QUERY_KEYS.franceHail],
    queryFn: () => getFranceMatrix(),
  });

  const { data: addOns } = useQuery({
    queryKey: ["addons", { isOn: true }],
    queryFn: ({ queryKey }: { queryKey: [string, { isOn: boolean }] }) => {
      const [, { isOn }] = queryKey;
      return getAddons(isOn);
    },
  });

  const form = useForm<HailEstimateFormValues>({
    values:
      (estimateHail as unknown as typeof defaultFormValues) ??
      defaultFormValues,
    resolver: yupResolver(hailEstimateSchema),
    shouldUnregister: false,
  });

  useEffect(() => {
    if (franceHailMatrix) {
      setHailRates(franceHailMatrix);
    }
  }, [franceHailMatrix]);

  const { data: hailMatrix, isLoading: isLoadingHailMatrix } = useQuery({
    queryKey: [QUERY_KEYS.franceHail],
    queryFn: () => getFranceMatrix(),
  });

  const { data: removeInstallMatrix, isLoading: isLoadingRemoveInstall } =
    useQuery({
      queryKey: [QUERY_KEYS.franceRemoveInstallMatrix],
      queryFn: () => getFranceRemoveInstall(),
    });

  const removeInstallCategories = removeInstallMatrix
    ? [
        { category: "Category A", value: removeInstallMatrix?.categoryA },
        { category: "Category B", value: removeInstallMatrix?.categoryB },
        { category: "Category C", value: removeInstallMatrix?.categoryC },
        { category: "Category D", value: removeInstallMatrix?.categoryD },
      ]
    : [];

  function getUTbyDents(dents: number) {
    return hailMatrix?.franceHailData?.find(
      (item) => item.min <= dents && item.max >= dents,
    )?.unitsTime;
  }

  const { fields: estimateHailPanel, update: updatePanel } = useFieldArray({
    control: form.control,
    name: "estimateHailPanel",
  });

  const panels = form.watch("estimateHailPanel") as Panel[];

  const total = panels?.reduce((acc: number, item: Panel) => {
    let sum: number = 0;
    if (item.panelTotal !== 0) {
      const total = item.panelTotal / 100;
      sum += total;
    }

    return acc + sum;
  }, 0);

  const rAndIPrice = form.watch("removeInstall")
    ? form.watch("removeInstall")
    : 0;

  const totalHailPrice =
    !!total || !!rAndIPrice
      ? ((Number(rAndIPrice) * 100 + total * 100) / 100).toFixed(2)
      : 0;

  const panelsCoef = [
    { name: "hood", coef: hailRates?.hood / 100 },
    { name: "leftFrontFender", coef: hailRates?.fender / 100 },
    { name: "leftFrontDoor", coef: hailRates?.door / 100 },
    { name: "leftRocker", coef: hailRates?.rocker / 100 },
    { name: "leftRearDoor", coef: hailRates?.door / 100 },
    { name: "leftQuarter", coef: hailRates?.quarter / 100 },
    { name: "rightFrontFender", coef: hailRates?.fender / 100 },
    { name: "rightFrontDoor", coef: hailRates?.door / 100 },
    { name: "rightRocker", coef: hailRates?.rocker / 100 },
    { name: "rightRearDoor", coef: hailRates?.door / 100 },
    { name: "rightQuarter", coef: hailRates?.quarter / 100 },
    { name: "roof", coef: hailRates?.roof / 100 },
    { name: "leftRail", coef: hailRates?.rail / 100 },
    { name: "rightRail", coef: hailRates?.rail / 100 },
    { name: "trunk", coef: hailRates?.trunk / 100 },
    { name: "windScreenFrame", coef: hailRates?.windScreenFrame / 100 },
    { name: "cowl", coef: hailRates?.windScreenFrame / 100 },
  ];

  const lightDentCoefficient = hailRates?.light / 100;
  const mediumDentCoefficient = hailRates?.medium / 100;
  const strongDentCoefficient = hailRates?.strong / 100;

  const aluminium = hailRates?.aluminium / 100;
  const technicalDents = hailRates?.technicalDents / 100;
  const repairAndPaint = hailRates?.repairAndPaint / 100;

  const pricePerUT = (hailRates?.rate / 100 / 60) * UT;

  const getPanelCoefficient = (panelName: string) => {
    return panelsCoef.find((item) => item.name === panelName).coef;
  };

  const panelTotal = (item: Panel) => {
    const panelCoefDifficulty = getPanelCoefficient(item.panel);
    const utByLightDents = getUTbyDents(Number(item.light)) || 0;
    const utByMediumDents = getUTbyDents(Number(item.medium)) || 0;
    const utByStrongDents = getUTbyDents(Number(item.strong)) || 0;
    const totalLightDents =
      pricePerUT *
      (utByLightDents / 100) *
      panelCoefDifficulty *
      lightDentCoefficient *
      (item.isAluminium ? aluminium : 1);

    const totalMediumDents =
      pricePerUT *
      (utByMediumDents / 100) *
      panelCoefDifficulty *
      mediumDentCoefficient *
      (item.isAluminium ? aluminium : 1);

    const totalStrongDents =
      pricePerUT *
      (utByStrongDents / 100) *
      panelCoefDifficulty *
      strongDentCoefficient *
      (item.isAluminium ? aluminium : 1);

    const totalTechnicalDents =
      Number(item.technicalDentsCount) > 0
        ? Number(item.technicalDentsCount) * technicalDents
        : 0;

    const total =
      totalLightDents +
      totalMediumDents +
      totalStrongDents +
      totalTechnicalDents;

    if (item.panelStatus === PanelSatus.repairAndPaint) {
      return total * repairAndPaint;
    }
    return total;
  };

  const panel0 = panelTotal(panels[0]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.0.panelTotal`,
      Number(panel0.toFixed(2)) * 100,
    );
  }, [panel0, form]);
  const panel1 = panelTotal(panels[1]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.1.panelTotal`,
      Number(panel1.toFixed(2)) * 100,
    );
  }, [panel1, form]);
  const panel2 = panelTotal(panels[2]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.2.panelTotal`,
      Number(panel2.toFixed(2)) * 100,
    );
  }, [panel2, form]);
  const panel3 = panelTotal(panels[3]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.3.panelTotal`,
      Number(panel3.toFixed(2)) * 100,
    );
  }, [panel3, form]);
  const panel4 = panelTotal(panels[4]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.4.panelTotal`,
      Number(panel4.toFixed(2)) * 100,
    );
  }, [panel4, form]);
  const panel5 = panelTotal(panels[5]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.5.panelTotal`,
      Number(panel5.toFixed(2)) * 100,
    );
  }, [panel5, form]);
  const panel6 = panelTotal(panels[6]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.6.panelTotal`,
      Number(panel6.toFixed(2)) * 100,
    );
  }, [panel6, form]);
  const panel7 = panelTotal(panels[7]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.7.panelTotal`,
      Number(panel7.toFixed(2)) * 100,
    );
  }, [panel7, form]);
  const panel8 = panelTotal(panels[8]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.8.panelTotal`,
      Number(panel8.toFixed(2)) * 100,
    );
  }, [panel8, form]);
  const panel9 = panelTotal(panels[9]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.9.panelTotal`,
      Number(panel9.toFixed(2)) * 100,
    );
  }, [panel9, form]);
  const panel10 = panelTotal(panels[10]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.10.panelTotal`,
      Number(panel10.toFixed(2)) * 100,
    );
  }, [panel10, form]);
  const panel11 = panelTotal(panels[11]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.11.panelTotal`,
      Number(panel11.toFixed(2)) * 100,
    );
  }, [panel11, form]);
  const panel12 = panelTotal(panels[12]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.12.panelTotal`,
      Number(panel12.toFixed(2)) * 100,
    );
  }, [panel12, form]);
  const panel13 = panelTotal(panels[13]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.13.panelTotal`,
      Number(panel13.toFixed(2)) * 100,
    );
  }, [panel13, form]);
  const panel14 = panelTotal(panels[14]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.14.panelTotal`,
      Number(panel14.toFixed(2)) * 100,
    );
  }, [panel14, form]);
  const panel15 = panelTotal(panels[15]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.15.panelTotal`,
      Number(panel15.toFixed(2)) * 100,
    );
  }, [panel15, form]);
  const panel16 = panelTotal(panels[16]);
  useEffect(() => {
    form.setValue(
      `estimateHailPanel.16.panelTotal`,
      Number(panel16.toFixed(2)) * 100,
    );
  }, [panel16, form]);

  useEffect(() => {
    if (total) {
      form.setValue(
        "total",
        Number(total.toFixed(2)) * 100 + Number(rAndIPrice) * 100,
      );
    }
  }, [total, form, rAndIPrice]);

  const createHailEstimate = useMutation({
    mutationFn: async (formData: CreateEstimateHail) => {
      const res = await hailEstimate({
        ...formData,
        removeInstall: Number(formData.removeInstall) * 100,
      });
      return res;
    },
    onSuccess: (data: EstimateHail) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.createHailEstimate],
      });
      toast({
        title: t("hailEstimate"),
        description: t("newHailEstimateHasBeenCreated"),
      });
      router.push(`/estimates/${data.id}/media`);
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
            ? tMatrix("companyNotFoundError")
            : t("thereWasAProblemWithYourRequest"),
        variant: "destructive",
      });
    },
  });

  const hailEstimateUpdate = useMutation({
    mutationFn: async (formData: CreateEstimateHail) => {
      await updateHailEstimate(
        {
          ...formData,
          removeInstall: Number(formData.removeInstall) * 100,
        },
        id as string,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.updateHailEstimate, id],
      });
      toast({
        title: t("hailEstimate"),
        description: t("estimateHasBeenUpdated"),
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

  console.log(form.formState.errors);

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

                <DefaultTextInput
                  fieldName="registrationNumber"
                  fieldLabel={t("registrationNumber")}
                  isTextUpperCase={true}
                />
              </div>

              <div
                className={`relative max-w-[${viewportWidth}] py-4 md:w-[420px]`}
              >
                <Image
                  src="/buttons-svg-100.jpg"
                  alt="car-image"
                  width={420}
                  height={560}
                />

                <SvgButtons onPathClick={handlePathClick} tag={openItem} />
              </div>

              <div
                className={`max-w-[${viewportWidth}] flex flex-col gap-2 border border-gray-200 p-4 py-2 md:w-[420px]`}
              >
                <h3>{t("rAndI")}</h3>
                <Select
                  onValueChange={(value) => {
                    form.setValue(
                      "removeInstall",
                      (Number(value) / 100).toFixed(2),
                    );
                  }}
                >
                  <SelectTrigger size="md" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {removeInstallCategories?.map((category, index) => {
                        return (
                          <SelectItem
                            key={`${category.category}-${category.value}`}
                            value={`${category.value}`}
                          >
                            {category.category}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <HailInput fieldName="removeInstall" />
              </div>

              <div>
                {estimateHailPanel.map((panel, index) => {
                  const addOnsWatch = form.watch(
                    `estimateHailPanel.${index}.addOns`,
                  ) as AddOnsType[];
                  const panelName = form.watch(`estimateHailPanel.${index}`);
                  if (panelName.panel !== panel.panel) return null;
                  return (
                    <div
                      key={panel.id}
                      className={`${openItem === panel.panel ? "block" : "hidden"} `}
                    >
                      <div className="flex flex-col items-start justify-between py-2 md:flex-row md:items-center">
                        <CarPanelStatus
                          fieldName={`estimateHailPanel.${index}.panelStatus`}
                          disabled={openItem === panel.panel ? false : true}
                          onNoDamagePanel={() => {
                            updatePanel(index, {
                              panel: panel.panel,
                              light: "",
                              medium: "",
                              strong: "",
                              panelStatus: PanelSatus.noDamage,
                              panelTotal: 0,
                              isAluminium: false,
                              isRandI: false,
                              rAndI: 0,
                              addOns: [],
                            });
                          }}
                          onHandsOfPanel={() => {
                            return updatePanel(index, {
                              panel: panel.panel,
                              light: "",
                              medium: "",
                              strong: "",
                              panelStatus: PanelSatus.hOff,
                              panelTotal: 0,
                              isAluminium: false,
                              isRandI: false,
                              rAndI: 0,
                              addOns: [],
                            });
                          }}
                          onChangePanel={() =>
                            updatePanel(index, {
                              panel: panel.panel,
                              light: "",
                              medium: "",
                              strong: "",
                              panelStatus: PanelSatus.change,
                              panelTotal: 0,
                              isAluminium: false,
                              isRandI: false,
                              rAndI: 0,
                              addOns: [],
                            })
                          }
                        />
                      </div>

                      <div
                        className={`flex transform flex-col transition-all duration-200 ease-in-out ${panelName.panelStatus === PanelSatus.pdr || panelName.panelStatus === PanelSatus.repairAndPaint ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                      >
                        <h3 className="font-semibold">{t(panel.panel)}</h3>
                        <div className="py-1">
                          <SwitchComp
                            fieldName={`estimateHailPanel.${index}.isAluminium`}
                            fieldLable="Aluminium"
                          />
                        </div>
                        <div className="flex w-full flex-col gap-4 py-2">
                          <div>
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-2">
                              <small>{t("lightDamage")}</small>
                            </div>
                            <div className="flex gap-2">
                              <HailInput
                                fieldName={`estimateHailPanel.${index}.light`}
                                panelName={panel.id}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-2">
                              <small>{t("mediumDamage")}</small>
                            </div>

                            <div className="flex gap-2">
                              <HailInput
                                fieldName={`estimateHailPanel.${index}.medium`}
                                panelName={panel.id}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-2">
                              <small>{t("strongDamage")}</small>
                            </div>

                            <div className="flex gap-2">
                              <HailInput
                                fieldName={`estimateHailPanel.${index}.strong`}
                                panelName={panel.id}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-2">
                              <small>{tMatrix("technicalDents")}</small>
                            </div>

                            <div className="flex gap-2">
                              <HailInput
                                fieldName={`estimateHailPanel.${index}.technicalDentsCount`}
                                panelName={panel.id}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <div>
                          <div>
                            <h3 className="py-1 text-lg font-semibold">
                              {t("rAndI")}
                            </h3>
                            <div className="py-1">
                              <AddOnsSwitch
                                fieldName={`estimateHailPanel.${index}.isRandI`}
                                panelId={panel.id}
                                rAndIID={`estimateHailPanel.${index}.rAndI`}
                              />
                              <div
                                className={`flex transform transition-all duration-200 ease-in-out ${
                                  !!form.watch(
                                    `estimateHailPanel.${index}.isRandI`,
                                  )
                                    ? "scale-100 opacity-100"
                                    : "scale-95 opacity-0"
                                } py-2`}
                              >
                                <HailInput
                                  fieldName={`estimateHailPanel.${index}.rAndI`}
                                  panelName={panel.id}
                                  startIcon={<Euro size={16} />}
                                />
                              </div>
                            </div>
                          </div>
                        </div> */}
                        {/* <div>
                          {addOns && addOns?.length > 0 && (
                            <div className="w-full">
                              <h3 className="py-1 text-lg font-semibold">
                                {t("addOns")}
                              </h3>
                              <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {addOns.map((addOn) => {
                                  const existingIndex = addOnsWatch.findIndex(
                                    (child) => child.name === addOn.name,
                                  );
                                  const isAdded = existingIndex !== -1;
                                  return (
                                    <div key={addOn.name} className="">
                                      <AddOns
                                        addOnName={addOn.name}
                                        nestedIndex={index}
                                        addOnIndex={existingIndex}
                                        isAdded={isAdded}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div> */}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-end py-4 text-2xl">
                <div className="flex items-center justify-center gap-1">
                  <p> {t("total")} = </p>
                  <div className="flex items-center justify-center">
                    <Euro size={22} /> {totalHailPrice}
                  </div>
                </div>
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

export default EstimateHailFranceForm;
