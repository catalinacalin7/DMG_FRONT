"use client";

import { Form } from "@/components/ui/form";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getHailMatrices } from "@/api/matrices/hail-matrix";
import { useEffect, useMemo, useRef, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useParams } from "next/navigation";
import { DownloadIcon, Euro } from "lucide-react";
import { getAddons } from "@/api/addons/addons";
import { getRandIMatrices } from "@/api/matrices/rAndi-matrix";
import { useToast } from "@/components/ui/use-toast";
import {
  EstimateHailPanel,
  getHailEstimateById,
  type EstimateHail,
} from "@/api/estimates/estimates";
import { useTranslations } from "next-intl";
import SVGComponent from "./SvgDiv";
import { AddOnsType } from "@/types/add-ons";
import { getClientById } from "@/api/client/get-by-id";
import { getVehicle } from "@/api/vehicles/vehicles";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatISO } from "date-fns";
import { getCompanyAvatar, getLogoCompany } from "@/api/company/company";
import { toPng } from "html-to-image";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { EstimatePdfDocument } from "./EstimatePdfDocument";
import { Button } from "@/components/ui/button";
import { CompanyData, CompanyPaymentData } from "@/types/company";
import { Panels } from "./constants/constants";
import { blobToBase64 } from "./utils/utils";
import { PdfLabels } from "./types/types";

enum PanelSatus {
  damaged = "damaged",
  noDamage = "noDamage",
  change = "change",
  hOff = "hOff",
}

export type Panel = {
  panel: string | undefined;
  light: string | undefined;
  medium: string | undefined;
  strong: string | undefined;
  lightQuotient: number | undefined;
  mediumQuotient: number | undefined;
  strongQuotient: number | undefined;
  panelStatus: PanelSatus;
  panelTotal: number;
  isRandI: boolean;
  rAndI: number;
  addOns: { name: string; isPercentages: boolean; amount: number }[];
};

const hailEstimateSchema = yup.object().shape({
  clientId: yup.string().required("Client is required"),
  vehicleId: yup.string().required("Vehicle is required"),
  estimateMode: yup.string().default("manual"),
  registrationNumber: yup.string(),
  rate: yup.number(),
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
      lightQuotient: yup.number().optional().typeError("Must be a number"),
      mediumQuotient: yup.number().optional().typeError("Must be a number"),
      strongQuotient: yup.number().optional().typeError("Must be a number"),
      panelStatus: yup
        .mixed()
        .oneOf([PanelSatus.damaged, PanelSatus.noDamage, PanelSatus.change]),
      panelTotal: yup.number(),
      isRandI: yup.boolean(),
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
const HailEstimateManualView = ({
  estimateHail,
  companyData,
  companyPayment,
}: {
  estimateHail?: EstimateHail;
  companyData: CompanyData;
  companyPayment: CompanyPaymentData;
}) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [carMakeLogo, setCarMakeLogo] = useState<string | null>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const t = useTranslations("PageEstimates");
  const tCarPanelStatus = useTranslations("CarPanelStatus");
  const tCompanyPayment = useTranslations("Settings.CompanyPayment");
  const tGarage = useTranslations("Garage");
  const tClient = useTranslations("PageClients");
  const tAddOns = useTranslations("Settings.AddOns");
  const tUI = useTranslations("ui");
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { id } = useParams();

  const estimateTitle = t("estimate");
  const pdfLabels = {
    make: tGarage("make"),
    vin: tGarage("vin"),
    year: tGarage("year"),
    plateNo: t("registrationNumber"),
    name: tClient("name"),
    taxID: tClient("taxID"),
    vatId: tClient("vatId"),
    address: tClient("address"),
    totalBeforeVat: t("Total before VAT"),
    vat: t("VAT"),
    totalInclVat: t("Total incl VAT"),
    bankDetails: t("bankDetails"),
    iban: tCompanyPayment("iban"),
    bic: tCompanyPayment("bic"),
    bankName: tCompanyPayment("bankName"),
    pdr: tCarPanelStatus("pdr"),
    repairAndPaint: tCarPanelStatus("repairAndPaint"),
    change: tCarPanelStatus("change"),
    noDamage: tCarPanelStatus("noDamage"),
    hOff: tCarPanelStatus("hOff"),
  };

  useEffect(() => {
    const fetchImage = async () => {
      const res = await getLogoCompany();
      const base64 = await blobToBase64(res as Blob);
      setImageBase64(base64);
    };

    fetchImage();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!svgRef.current) return;

      toPng(svgRef.current)
        .then((url) => setDataUrl(url))
        .catch((err) => console.error("Image conversion failed:", err));
    }, 300);
  }, []);

  const form = useForm<HailEstimateFormValues>({
    values: estimateHail ?? defaultFormValues,
    resolver: yupResolver(hailEstimateSchema),
    shouldUnregister: false,
  });

  const vehicleId = form.watch("vehicleId");

  const { fields: estimateHailPanel, update: updatePanel } = useFieldArray({
    control: form.control,
    name: "estimateHailPanel",
  });

  const panels = form.watch("estimateHailPanel") as Panel[];
  const rate = form.watch("rate") as number;

  const total = panels?.reduce((acc: number, item: Panel) => {
    if (!!item.addOns) {
      let sum: number =
        Number(item.lightQuotient) +
        Number(item.mediumQuotient) +
        Number(item.strongQuotient) +
        Number(item.rAndI);
      item.addOns.forEach((addOn) => {
        if (addOn.isPercentages) {
          sum *= Number(addOn.amount) / 100 + 1;
        } else {
          sum += Number(addOn.amount);
        }
        return sum;
      });
      return acc + sum;
    }
    const totalPanel =
      Number(item.lightQuotient) +
      Number(item.mediumQuotient) +
      Number(item.strongQuotient) +
      Number(item.rAndI);
    return acc + totalPanel;
  }, 0);

  const totalWhithoutAddOns = panels?.reduce((acc: number, item: Panel) => {
    const totalPanel =
      Number(item.lightQuotient) +
      Number(item.mediumQuotient) +
      Number(item.strongQuotient) +
      Number(item.rAndI);
    return acc + totalPanel;
  }, 0);

  const totalHailPrice = !!total ? Number(total).toFixed(2) : 0;

  const panelTotal = (item: Panel) => {
    let sum: number;
    if (item.addOns.length > 0) {
      sum =
        Number(item.lightQuotient) +
        Number(item.mediumQuotient) +
        Number(item.strongQuotient) +
        Number(item.rAndI);
      item.addOns.forEach((addOn) => {
        if (addOn.isPercentages) {
          sum *= Number(addOn.amount) / 100 + 1;
        } else {
          sum += Number(addOn.amount);
        }
      });
    } else {
      sum =
        Number(item.lightQuotient) +
        Number(item.mediumQuotient) +
        Number(item.strongQuotient) +
        Number(item.rAndI);
    }
    return sum;
  };

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

  const handlePathClick = (pathId: string) => {
    setOpenItem((prev) => {
      if (prev === pathId) {
        return undefined;
      }
      return pathId;
    });
  };

  const tranlatedPanels = estimateHail?.estimateHailPanel.map((item, index) => {
    return {
      ...item,
      panel: t(item.panel),
      addOns:
        item?.addOns.length > 0
          ? item.addOns.map((addOn) => {
              return {
                ...addOn,
                name: tAddOns(addOn.name),
              };
            })
          : item.addOns,
    };
  });

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

  if (isLoadingClientData) return <LoadingScreen />;

  return (
    <div className="">
      <div>
        <div className="flex flex-col gap-2">
          <div className="text-right">
            <Button type="button" size="sm">
              <DownloadIcon className="mr-2 h-5 text-white" />
              <PDFDownloadLink
                document={
                  <EstimatePdfDocument
                    estimateTitle={estimateTitle}
                    labels={pdfLabels as PdfLabels}
                    logo={imageBase64 as string}
                    carImg={dataUrl as string}
                    estimateHail={estimateHail as EstimateHail}
                    panels={tranlatedPanels as EstimateHailPanel[]}
                    totalWhithoutAddOns={totalWhithoutAddOns as number}
                    companyData={companyData}
                    companyPayment={companyPayment}
                  />
                }
                fileName={`Estimate-${estimateHail?.estimateNumber}`}
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Loading document..." : "Download Pdf"
                }
              </PDFDownloadLink>
            </Button>
          </div>
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

              <div className="flex items-center justify-center py-4 text-2xl">
                <div className="flex items-center justify-center gap-1">
                  <p> {t("total")} = </p>
                  <div className="flex items-center justify-center">
                    <Euro size={22} /> {totalHailPrice}
                  </div>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row">
                <div
                  ref={svgRef}
                  className={`flex items-center justify-center ${!vehicleId ? "pointer-events-none" : ""}`}
                >
                  <SVGComponent onPathClick={handlePathClick} tag={openItem} />
                </div>

                <div>
                  {estimateHailPanel.map((panel, index) => {
                    const light = form.watch(
                      `estimateHailPanel.${index}.light`,
                    );
                    const lightQuotient = form.watch(
                      `estimateHailPanel.${index}.lightQuotient`,
                    );
                    const medium = form.watch(
                      `estimateHailPanel.${index}.medium`,
                    );
                    const mediumQuotient = form.watch(
                      `estimateHailPanel.${index}.mediumQuotient`,
                    );
                    const strong = form.watch(
                      `estimateHailPanel.${index}.strong`,
                    );
                    const strongQuotient = form.watch(
                      `estimateHailPanel.${index}.strongQuotient`,
                    );
                    const isRandI = form.watch(
                      `estimateHailPanel.${index}.isRandI`,
                    );
                    const rAndI = form.watch(
                      `estimateHailPanel.${index}.rAndI`,
                    );
                    const addOnsWatch = form.watch(
                      `estimateHailPanel.${index}.addOns`,
                    ) as AddOnsType[];
                    return (
                      <div
                        key={panel.id}
                        className={`${openItem === panel.panel ? "block" : "hidden"} `}
                      >
                        <div
                          className={`flex transform flex-col transition-all duration-200 ease-in-out ${form.watch(`estimateHailPanel.${index}.panelStatus`) === PanelSatus.damaged ? "scale-100 opacity-100" : "scale-95 opacity-0"} `}
                        >
                          <h3 className="font-semibold">{t(panel.panel)}</h3>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2 md:flex-row">
                              <div className="flex flex-col text-gray-400 lg:flex-row lg:justify-between lg:gap-2">
                                <div>{t("lightDamage")}(0-20mm)</div>
                              </div>
                              <div className="flex gap-3 font-semibold">
                                <p>Dents: {light}</p>
                                <div className="flex">
                                  <p>Cost:</p>
                                  <div className="flex items-center gap-1">
                                    {" "}
                                    <Euro size={16} />
                                    <p>{lightQuotient}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 md:flex-row">
                              <div className="flex flex-col text-gray-400 lg:flex-row lg:justify-between lg:gap-2">
                                <div>{t("mediumDamage")}(21-31mm)</div>
                              </div>
                              <div className="flex gap-3 font-semibold">
                                <p>Dents: {medium}</p>
                                <div className="flex">
                                  <p>Cost:</p>
                                  <div className="flex items-center gap-1">
                                    {" "}
                                    <Euro size={16} />
                                    <p>{mediumQuotient}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 md:flex-row">
                              <div className="flex flex-col text-gray-400 lg:flex-row lg:justify-between lg:gap-2">
                                <div>{t("strongDamage")}(32-45mm)</div>
                              </div>
                              <div className="flex gap-3 font-semibold">
                                <p>Dents: {strong}</p>
                                <div className="flex">
                                  <p>Cost:</p>
                                  <div className="flex items-center gap-1">
                                    {" "}
                                    <Euro size={16} />
                                    <p>{strongQuotient}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
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
                          </div>
                          <div>
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
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default HailEstimateManualView;
