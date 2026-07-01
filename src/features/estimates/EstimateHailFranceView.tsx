"use client";

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
import type { EstimateHail } from "@/api/estimates/estimates";
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
import { FranceHailTypeSchema } from "../settings/matrices/hail-matrix-france-form/schema";
import { FranceHailMatrix } from "@/api/matrices/france-hail-matrix";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCompanyAvatar } from "@/api/company/company";
import { formatISO } from "date-fns";
import { getClientById } from "@/api/client/get-by-id";
import { getVehicle } from "@/api/vehicles/vehicles";
import { CompanyData, CompanyPaymentData } from "@/types/company";
import type { EstimateHailPanel } from "@/api/estimates/estimates";
import { PanelSatus } from "@/api/estimates/estimates";

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
    panelStatus: "noDamage",
    panelTotal: 0,
    isRandI: false,
    rAndI: 0,
    addOns: [],
    estimatePanelLabel: [],
  })),
} as const;

type HailEstimateFormValues = yup.InferType<typeof hailEstimateSchema>;

const EstimateHailFranceView = ({
  estimateHail,
  companyData,
  companyPayment,
}: {
  estimateHail?: EstimateHail;
  companyData: CompanyData;
  companyPayment: CompanyPaymentData;
}) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [hailRates, setHailRates] = useState<FranceHailMatrix>();
  const t = useTranslations("PageEstimates");
  const tGarage = useTranslations("Garage");
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

  const vehicleId = form.watch("vehicleId");

  const { data: hailMatrix, isLoading: isLoadingHailMatrix } = useQuery({
    queryKey: [QUERY_KEYS.franceHail],
    queryFn: () => getFranceMatrix(),
  });

  function getUTbyDents(dents: number) {
    return hailMatrix?.franceHailData?.find(
      (item) => item.min <= dents && item.max >= dents,
    )?.unitsTime;
  }

  const { fields: estimateHailPanel, update: updatePanel } = useFieldArray({
    control: form.control,
    name: "estimateHailPanel",
  });

  const panels = form.watch("estimateHailPanel") as EstimateHailPanel[];

  const total = panels?.reduce((acc: number, item: EstimateHailPanel) => {
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
      ? ((Number(rAndIPrice) + total * 100) / 100).toFixed(2)
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

  const panelTotal = (item: EstimateHailPanel) => {
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

  const clientId = form.watch("clientId");
  const registrationNumber = form.watch("registrationNumber");

  const { data: companyAvatar, isLoading: isLoadingCompanyAvatar } = useQuery({
    queryKey: [QUERY_KEYS.companyAvatar],
    queryFn: () => getCompanyAvatar(),
  });

  const { data: clientData, isLoading: isLoadingClientData } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId as string),
    enabled: !!clientId,
  });

  const { data: vehicleData, isLoading: isLoadingVehicle } = useQuery({
    queryKey: [QUERY_KEYS.garages, vehicleId, "vehicleData"],
    queryFn: async () => await getVehicle(vehicleId as string),
  });

  const estimateDate =
    estimateHail?.createdAt !== undefined
      ? formatISO(new Date(estimateHail?.createdAt), { representation: "date" })
      : "";

  return (
    <div className="">
      <div>
        <div className="flex gap-2">
          <Form {...form}>
            <form className="w-full">
              <div className="flex justify-between py-4">
                <Avatar className="h-20 w-24 self-center rounded-none md:h-24 md:w-32">
                  <AvatarImage src={`${companyAvatar}`} loading="lazy" />
                  <AvatarFallback className="bg-muted text-xl font-medium text-blue-600"></AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <h3 className="text-xl font-bold md:text-2xl">
                    {t("estimate")}
                  </h3>
                  <h4 className="text-lg md:text-xl">
                    {estimateHail?.estimateNumber}
                  </h4>
                  <h4 className="text-lg md:text-xl">{estimateDate}</h4>
                </div>
              </div>
              <div className="3 grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="flex flex-col">
                  <h3 className="rounded-t-xl bg-gray-200 py-2 pl-5">
                    Vehicle
                  </h3>
                  <div className="flex items-center gap-1 md:gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-bl-xl bg-blue-50 md:h-32 md:w-32 md:p-5">
                      {vehicleData?.make && (
                        <Image
                          src={`https://www.carlogos.org/logo/${vehicleData.make}-logo.png`}
                          width={96}
                          height={96}
                          alt="car mark"
                        />
                      )}
                    </div>
                    <div>
                      <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
                        <div className="text-sm font-medium text-gray-300 md:text-base">
                          {tGarage("make")}
                        </div>
                        <div className="col-span-3 flex justify-start text-sm font-medium text-black sm:col-span-1 md:text-base">
                          {vehicleData?.make && vehicleData.make}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm sm:grid-cols-2 md:text-base">
                        <div className="font-medium text-gray-300">
                          {tGarage("vin")}
                        </div>
                        <div className="col-span-3 flex items-start text-sm font-medium text-black sm:col-span-1 md:text-base">
                          {vehicleData?.vinNumber && vehicleData.vinNumber}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
                        <div className="text-sm font-medium text-gray-300 md:text-base">
                          {tGarage("year")}
                        </div>
                        <div className="col-span-3 flex items-start text-sm font-medium text-black sm:col-span-1 md:text-base">
                          {vehicleData?.year && vehicleData.year}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
                        <div className="text-nowrap text-sm font-medium text-gray-300 md:text-base">
                          {t("registrationNumber")}
                        </div>
                        <div className="col-span-3 flex items-start text-sm font-medium text-black sm:col-span-1 md:text-base">
                          {registrationNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="rounded-t-xl bg-gray-200 py-2 pl-5">Client</h3>
                  <div className="flex items-center">
                    <div className="h-24 w-full rounded-b-xl bg-blue-50 px-5 py-2 md:h-32 md:p-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-start text-center text-sm font-bold text-black md:text-base">
                          {clientData && clientData.name}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-start text-center text-sm font-medium text-black md:text-base">
                          {clientData && clientData.address}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start text-nowrap text-center text-sm font-medium text-black md:text-base">
                          {clientData &&
                            `${clientData.city}, ${clientData.country}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 md:flex-row">
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
                <div className="md:py-4">
                  <div className="pb-4">
                    <h3 className="border-b font-semibold">{t("rAndI")}</h3>
                    <h4 className="flex items-center">
                      <Euro size={18} />
                      {(Number(rAndIPrice) / 100).toFixed(2)}
                    </h4>
                  </div>
                  {estimateHailPanel.map((panel, index) => {
                    const light = form.watch(
                      `estimateHailPanel.${index}.light`,
                    );
                    const medium = form.watch(
                      `estimateHailPanel.${index}.medium`,
                    );
                    const strong = form.watch(
                      `estimateHailPanel.${index}.strong`,
                    );

                    const panelName = form.watch(`estimateHailPanel.${index}`);
                    if (panelName.panel !== panel.panel) return null;
                    return (
                      <div
                        key={panel.id}
                        className={`${openItem === panel.panel ? "block" : "hidden"} `}
                      >
                        <div
                          className={`flex transform flex-col transition-all duration-200 ease-in-out ${panelName.panelStatus === PanelSatus.pdr || panelName.panelStatus === PanelSatus.repairAndPaint ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                        >
                          <h3 className="border-b font-semibold">
                            {t(panel.panel)}
                          </h3>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2">
                              <div className="flex text-gray-500 lg:flex-row lg:justify-between lg:gap-2">
                                {t("lightDamage")} {t("impact")}:{" "}
                              </div>
                              <div className="flex gap-3 font-semibold">
                                {panel.light !== "" ? panel.light : 0}
                              </div>
                            </div>
                            <div className="flex flex-row gap-2">
                              <div className="flex flex-col text-gray-500 lg:flex-row lg:justify-between lg:gap-2">
                                {t("mediumDamage")} {t("impact")}:
                              </div>
                              <div className="flex gap-3 font-semibold">
                                {panel.medium !== "" ? panel.medium : 0}
                              </div>
                            </div>
                            <div className="flex flex-row gap-2">
                              <div className="flex flex-col text-gray-500 lg:flex-row lg:justify-between lg:gap-2">
                                {t("strongDamage")} {t("impact")}:
                              </div>
                              <div className="flex gap-3 font-semibold">
                                {panel.strong !== "" ? panel.strong : 0}
                              </div>
                            </div>
                            <div className="flex flex-row gap-2">
                              <div className="flex flex-col text-gray-500 lg:flex-row lg:justify-between lg:gap-2">
                                <div>{tMatrix("technicalDents")}: </div>
                              </div>
                              <div className="flex gap-3 font-semibold">
                                <p>{panel.technicalDentsCount}</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 lg:flex-row">
                              <div className="flex flex-col text-gray-500 lg:flex-row lg:justify-between lg:gap-2">
                                {t("comments")}
                              </div>
                              <div className="flex flex-col gap-3 font-semibold lg:flex-row lg:flex-wrap">
                                {panel?.estimatePanelLabel?.map((label) => {
                                  return (
                                    <p key={label.label}>{t(label.label)} </p>
                                  );
                                })}
                                {panel?.comment}
                              </div>
                            </div>
                          </div>
                          {/* <div>
                            {isRandI && (
                              <div className="flex items-center gap-2">
                                <h3 className="py-1 text-lg font-semibold text-gray-400">
                                  {t("rAndI")}
                                </h3>
                                <div className="font-semibold">
                                  <div className="flex items-center gap-1">
                                    {" "}
                                    <Euro size={16} />
                                    <p>{rAndI}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div> */}
                          {/* <div>
                            {addOnsWatch?.length > 0 && (
                              <div className="w-full">
                                <h3 className="py-1 text-lg font-semibold">
                                  {t("addOns")}
                                </h3>
                                <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                  {addOnsWatch.map((addOn) => {
                                    return (
                                      <div
                                        key={addOn.name}
                                        className="flex items-center gap-2 text-lg font-semibold capitalize"
                                      >
                                        <p className="font-semibold capitalize text-gray-400">
                                          {addOn.name}
                                        </p>
                                        {addOn.isPercentages ? (
                                          <p>{addOn.amount}%</p>
                                        ) : (
                                          <div className="flex items-center gap-1">
                                            {<Euro size={16} />} {addOn.amount}
                                          </div>
                                        )}
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
              </div>
              <div className="flex items-center justify-end py-4 text-2xl">
                <div className="flex items-center justify-center gap-1">
                  <p> {t("total")} = </p>
                  <div className="flex items-center justify-center">
                    <Euro size={22} /> {totalHailPrice}
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EstimateHailFranceView;
