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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ClientSearchSelector from "./ClientSearchSelector";
import VehicleSearchSelector from "./VehicleSearchSelector";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import CarPanelStatus from "./CarPanelStatus";
import { useParams, useSearchParams } from "next/navigation";
import { Euro, Check, Tags, ChevronRight } from "lucide-react";
import {
  hailEstimate,
  saveEstimageImage,
  updateHailEstimate,
} from "@/api/estimates/estimates";
import type {
  CreateEstimateHail,
  EstimateHail,
  EstimateHailPanel,
} from "@/api/estimates/estimates";
import { useLocale, useTranslations } from "next-intl";
import DefaultTextInput from "@/components/inputs/DefaultTextInput";
import HailInput from "@/components/inputs/HailInput";
import { AddOnsType } from "@/types/add-ons";
import { usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import SvgButtons from "./SvgButtons";
import { getFranceMatrix } from "@/api/matrices/france-hail-matrix";
import { FranceHailMatrix } from "@/api/matrices/france-hail-matrix";
import SwitchComp from "@/components/switches/SwitchComp";
import { getFranceRemoveInstall } from "@/api/matrices/france-remove-install";
import EstimatePanelComment from "./EstimatePanelComment";
import EstimatePanelLabel from "./EstimatePanelLabel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PanelSatus } from "@/api/estimates/estimates";
import type { Panel } from "./types/types";
import { CompanyData, CompanyPaymentData } from "@/types/company";
import { Panels } from "./constants/constants";
import { toast } from "sonner";
import SvgRoundButtons from "./SvgRoundButtons";
import type { CarBody } from "./types/types";
import SvgRoundButtonsTruck from "./SvgRoundButtonsTruck";
import SvgRoundButtonsVan from "./SvgRoundButtonsVan";
import { CURRENCY_CODE_ESTIMATE } from "../settings/constants/constants";
import SelectLabelTop from "@/components/inputs/SelectLabelTop";

import { toBlob } from "html-to-image";
import { getVehicle } from "@/api/vehicles/vehicles";

// UT = units of time
const UT = 6;

const hailEstimateSchema = yup.object().shape({
  clientId: yup.string().required("Client is required"),
  vehicleId: yup.string().required("Vehicle is required"),
  carBody: yup.string(),
  estimateMode: yup.string().default("manual"),
  registrationNumber: yup.string().uppercase(),
  removeInstall: yup
    .string()
    .required("This field is required.")
    .matches(/^\d+\.\d{2}$/, "Must be a number with two decimals.")
    .default("0"),
  currency: yup.string().required("Currency is required"),
  total: yup.number().required(),
  retainedPrice: yup
    .string()
    .matches(/^[1-9]\d*\.\d{2}$/, "Must be grater than 0 plus two decimals.")
    .required("This field is required.")
    .transform((value) => {
      return value.replace(",", ".");
    }),
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
      comment: yup.string().optional(),
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
      estimatePanelLabel: yup.array().of(
        yup.object().shape({
          label: yup.string(),
        }),
      ),
    }),
  ),
});

type HailEstimateFormValues = yup.InferType<typeof hailEstimateSchema>;

const EstimateHailFranceFormV2 = ({
  estimateHail,
  companyData,
  companyPayment,
  vehicleType,
}: {
  estimateHail?: EstimateHail;
  companyData: CompanyData;
  companyPayment?: CompanyPaymentData;
  vehicleType?: string;
}) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [dentsOrComments, setDentsOrComments] = useState(false);
  const [hailRates, setHailRates] = useState<FranceHailMatrix>();
  const t = useTranslations("PageEstimates");
  const tActions = useTranslations("ToastActions");
  const tMatrix = useTranslations("Settings.Matrix");
  const locale = useLocale();
  const svgRef = useRef<HTMLDivElement>(null);
  const tUI = useTranslations("ui");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const viewportWidth = window.innerWidth;

  const { data: franceHailMatrix } = useQuery({
    queryKey: [QUERY_KEYS.franceHail],
    queryFn: () => getFranceMatrix(),
  });

  const form = useForm<HailEstimateFormValues>({
    values: estimateHail
      ? {
          clientId: estimateHail.clientId,
          vehicleId: estimateHail.vehicleId,
          carBody: vehicleType,
          estimateMode: estimateHail.estimateMode,
          removeInstall: estimateHail.removeInstall,
          currency: estimateHail.currency
            ? estimateHail.currency
            : companyData.currencyCode,
          registrationNumber: estimateHail.registrationNumber,
          total: estimateHail.total,
          retainedPrice: estimateHail.retainedPrice,
          discount: estimateHail.discount,
          estimateHailPanel: estimateHail.estimateHailPanel,
        }
      : {
          clientId: "",
          vehicleId: "",
          carBody: "",
          estimateMode: "manual",
          removeInstall: "0.00",
          currency: companyData.currencyCode,
          registrationNumber: "",
          total: 0,
          retainedPrice: "0.00",
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
            comment: "",
            rAndI: 0,
            addOns: [],
            estimatePanelLabel: [],
          })),
        },
    resolver: yupResolver(hailEstimateSchema),
    shouldUnregister: false,
  });

  const currency = form.watch("currency");

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

  const totalDents = panels?.reduce((acc: number, item: Panel) => {
    let sum: number = 0;
    if (item.panelTotal !== 0) {
      const total =
        Number(item.light) +
        Number(item.medium) +
        Number(item.strong) +
        Number(item.technicalDentsCount);
      sum += total;
    }

    return acc + sum;
  }, 0);

  const rAndIPrice = form.watch("removeInstall")
    ? form.watch("removeInstall")
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
    mutationFn: async (values: CreateEstimateHail): Promise<EstimateHail> => {
      const res = (await hailEstimate({
        ...values,
        removeInstall: Number(values.removeInstall) * 100,
        retainedPrice: Number(values.retainedPrice) * 100,
      })) as EstimateHail;

      const url = await toBlob(svgRef.current);

      const formData = new FormData();
      formData.append("image", url, `estimate-${res?.id}.png`);
      // @ts-ignore
      await saveEstimageImage(res?.id, formData);
      return res as EstimateHail;
    },
    onSuccess: (data: EstimateHail) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.createHailEstimate],
      });
      toast.success(t("estimate"), {
        description: tActions("created"),
      });
      router.push("/estimates");
    },
    onError: () => {
      toast.error(t("estimate"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const hailEstimateUpdate = useMutation({
    mutationFn: async (values: any) => {
      delete values?.vehicle;
      delete values?.carBody;
      const res = await updateHailEstimate(
        {
          ...values,

          removeInstall: Number(values.removeInstall) * 100,
          retainedPrice: Number(values.retainedPrice) * 100,
        },
        id as string,
      );

      const url = await toBlob(svgRef.current);

      const formData = new FormData();
      formData.append("image", url, `estimate-${id}.png`);
      // @ts-ignore
      await saveEstimageImage(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.updateHailEstimate, id],
      });
      toast.success(t("estimate"), {
        description: tActions("updated"),
      });
      router.push("/estimates");
    },
    onError: () => {
      toast.error(t("estimate"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const handlePathClick = (pathId: string) => {
    setOpenItem(pathId);
    setOpen(true);
    const panelIndex = panels.findIndex((panel) => panel.panel === pathId);
    if (
      form.watch(`estimateHailPanel.${panelIndex}.panelStatus`) ===
      PanelSatus.noDamage
    ) {
      form.setValue(
        `estimateHailPanel.${panelIndex}.panelStatus`,
        PanelSatus.pdr,
      );
    }
  };

  const totalHailPrice =
    !!total || !!rAndIPrice
      ? ((Number(rAndIPrice) * 100 + total * 100) / 100).toFixed(2)
      : 0;

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

  const vehicleId = form.watch("vehicleId");
  const carBody = form.watch("carBody");

  const getVehicleBody = (type: CarBody) => {
    if (type === "suv" || type === "crossover") {
      return "/suv.png";
    }
    if (type === "wagon") {
      return "/wagon.png";
    }
    if (type === "van") {
      return "/van.png";
    }
    if (type === "pickup_truck") {
      return "/pickup.png";
    }
    return "/sedan.png";
  };

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
              <div className="grid w-full grid-cols-1 justify-items-center gap-3 md:grid-cols-2 xl:grid-cols-3">
                <ClientSearchSelector />

                <VehicleSearchSelector />

                <DefaultTextInput
                  fieldName="registrationNumber"
                  fieldLabel={t("registrationNumber")}
                  isTextUpperCase={true}
                />
              </div>
              <div className={`${vehicleId && carBody ? "block" : "hidden"}`}>
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
                  <div className="flex flex-col">
                    <div
                      key={`${id}`}
                      ref={svgRef}
                      className={`relative max-w-[${viewportWidth}] md:w-[420px]`}
                    >
                      <img
                        src={getVehicleBody(carBody as CarBody)}
                        alt={`car-image${getVehicleBody(carBody as CarBody)}`}
                        width={420}
                        height={580}
                        className="bg-white"
                      />
                      {carBody === "pickup_truck" ? (
                        <SvgRoundButtonsTruck
                          onPathClick={handlePathClick}
                          tag={openItem}
                        />
                      ) : carBody === "van" ? (
                        <SvgRoundButtonsVan
                          onPathClick={handlePathClick}
                          tag={openItem}
                        />
                      ) : (
                        <SvgRoundButtons
                          onPathClick={handlePathClick}
                          tag={openItem}
                        />
                      )}
                    </div>
                    <div className="flex items-start gap-1">
                      <p> {t("impact")}: </p>
                      <div className="flex items-center justify-center">
                        {totalDents > 0 ? totalDents : 0}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div
                      className={`max-w-[${viewportWidth}] flex flex-col gap-2 rounded-lg border border-gray-200 p-4 py-2 md:w-[420px]`}
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
                    <div
                      className={`max-w-[${viewportWidth}] flex flex-col items-center justify-end py-4 md:w-[420px]`}
                    >
                      <div className="flex w-full flex-col items-start gap-2">
                        <SelectLabelTop
                          fieldName="currency"
                          fieldLabel="Currency"
                          options={CURRENCY_CODE_ESTIMATE}
                        />
                        <div className="w-full">
                          <p className="text-base">{t("total")}</p>
                          <div className="flex h-10 w-full items-center justify-between rounded-lg border pl-3">
                            <div className="flex items-center text-sm">
                              {currency} {totalHailPrice}
                            </div>
                            <Button
                              type="button"
                              variant="secondary"
                              className="rounded-lg! rounded-l-none! h-[38px] w-10"
                              onClick={() =>
                                form.setValue(
                                  "retainedPrice",
                                  String(totalHailPrice),
                                )
                              }
                            >
                              <ChevronRight className="h-6! w-6!" />
                            </Button>
                          </div>
                        </div>
                        <div className="w-full">
                          <p className="text-base">{t("retainedPrice")}</p>
                          <HailInput
                            fieldName="retainedPrice"
                            inputMode="decimal"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Drawer
                  open={open}
                  onOpenChange={setOpen}
                  repositionInputs={false}
                >
                  <DrawerContent className="h-full bg-white">
                    <DrawerHeader className="gap-0 p-0">
                      <DrawerTitle></DrawerTitle>
                      <DrawerDescription></DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea>
                      <div
                        className={`mx-auto h-full w-full px-6 md:w-[420px]`}
                      >
                        {estimateHailPanel.map((panel, index) => {
                          const addOnsWatch = form.watch(
                            `estimateHailPanel.${index}.addOns`,
                          ) as AddOnsType[];
                          const panelName = form.watch(
                            `estimateHailPanel.${index}`,
                          );
                          if (panelName.panel !== panel.panel) return null;
                          return (
                            <div
                              key={panel.id}
                              className={`${openItem === panel.panel ? "block" : "hidden"} `}
                            >
                              <h3 className="text-center font-semibold">
                                {t(panel.panel)}
                              </h3>
                              <div className="flex flex-col items-center py-2">
                                <CarPanelStatus
                                  fieldName={`estimateHailPanel.${index}.panelStatus`}
                                  disabled={
                                    openItem === panel.panel ? false : true
                                  }
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
                                      comment: "",
                                      addOns: [],
                                      estimatePanelLabel: [],
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
                                      comment: "",
                                      addOns: [],
                                      estimatePanelLabel: [],
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
                                      comment: "",
                                      addOns: [],
                                      estimatePanelLabel: [],
                                    })
                                  }
                                />
                              </div>
                              <div
                                className={`flex transform flex-col items-center justify-center transition-all duration-200 ease-in-out ${panelName.panelStatus === PanelSatus.pdr || panelName.panelStatus === PanelSatus.repairAndPaint ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                              >
                                <div className="flex w-full items-center justify-between gap-8 py-1">
                                  <div className="py-1">
                                    <SwitchComp
                                      fieldName={`estimateHailPanel.${index}.isAluminium`}
                                      fieldLable="Aluminium"
                                    />
                                  </div>
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-md"
                                    onClick={() =>
                                      setDentsOrComments((prev) => !prev)
                                    }
                                  >
                                    <Tags className="!size-5" />
                                  </Button>
                                </div>
                                <div
                                  className={`${!dentsOrComments ? "flex w-full flex-col gap-4 py-2" : "hidden"}`}
                                >
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
                                <div
                                  className={`${dentsOrComments ? "flex w-full flex-col gap-2 py-4" : "hidden"}`}
                                >
                                  <EstimatePanelLabel
                                    fieldName={`estimateHailPanel.${index}.estimatePanelLabel`}
                                  />
                                  <EstimatePanelComment
                                    fieldName={`estimateHailPanel.${index}.comment`}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end py-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="rounded-md bg-green-400 px-2"
                                  onClick={() => {
                                    setOpen(false);
                                    setOpenItem(undefined);
                                    setDentsOrComments(false);
                                  }}
                                >
                                  <Check
                                    className="h-8 w-8"
                                    color="white"
                                    style={{ width: "32px", height: "32px" }}
                                  />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </DrawerContent>
                </Drawer>

                <div className="flex justify-end gap-2 py-4">
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
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
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EstimateHailFranceFormV2;
