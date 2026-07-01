"use client";

import { Form } from "@/components/ui/form";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { useParams, useSearchParams } from "next/navigation";
import { DownloadIcon, Send } from "lucide-react";
import { getAddons } from "@/api/addons/addons";
import type { EstimateHail } from "@/api/estimates/estimates";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCompanyAvatar, getLogoCompany } from "@/api/company/company";
import { format, formatISO } from "date-fns";
import { getClientById } from "@/api/client/get-by-id";
import { getVehicle } from "@/api/vehicles/vehicles";
import { CompanyData, CompanyPaymentData } from "@/types/company";
import type { SendPdf } from "@/api/estimates/estimates";
import { PanelSatus, sendPdfEstimate } from "@/api/estimates/estimates";
import { Panel, PdfLabels } from "./types/types";
import { blobToBase64 } from "./utils/utils";
import { toPng } from "html-to-image";
import {
  BlobProvider,
  pdf,
  PDFDownloadLink,
  PDFViewer,
  usePDF,
} from "@react-pdf/renderer";
import { EstimatePdfDocument } from "./EstimatePdfDocument";
import { Panels } from "./constants/constants";
import SvgRoundButtons from "./SvgRoundButtons";
import type { CarBody } from "./types/types";
import SvgRoundButtonsTruck from "./SvgRoundButtonsTruck";
import SvgRoundButtonsVan from "./SvgRoundButtonsVan";
import { Spinner } from "@/components/ui/spinner";
import DialogBox from "@/components/dialogs/DialogBox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DefaultTextInput from "@/components/inputs/DefaultTextInput";
import TextareaInput from "@/components/inputs/TextareaInput";
import { toast } from "sonner";
import { toDecimal } from "@/utils/numberUtils";
const UT = 6;

const sendPdfSchema = yup.object().shape({
  email: yup.string().email("Email must be a valid email").required(),
  subject: yup.string(),
  message: yup.string(),
});

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
    .required("This field is required.")
    .matches(/^[1-9]\d*\.\d{2}$/, "Must be grater than 0 plus two decimals."),
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
  carBody: "",
  estimateMode: "manual",
  removeInstall: "0.00",
  currency: "",
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
} as const;

type HailEstimateFormValues = yup.InferType<typeof hailEstimateSchema>;
type SendPdfSchemaType = yup.InferType<typeof sendPdfSchema>;

const EstimateHailFranceViewV2 = ({
  estimateHail,
  companyData,
  companyPayment,
  vehicleType,
}: {
  estimateHail?: EstimateHail;
  companyData: CompanyData;
  companyPayment?: CompanyPaymentData;
  vehicleType: string;
}) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const svgRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("PageEstimates");
  const tGarage = useTranslations("Garage");
  const tMatrix = useTranslations("Settings.Matrix");
  const tClient = useTranslations("PageClients");
  const tCarPanelStatus = useTranslations("CarPanelStatus");
  const tCompanyPayment = useTranslations("Settings.CompanyPayment");
  const tUI = useTranslations("ui");
  const tActions = useTranslations("ToastActions");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = useLocale();
  const viewportWidth = window.innerWidth;
  const { id } = useParams();
  const queryClient = useQueryClient();

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
      : defaultFormValues,
    resolver: yupResolver(hailEstimateSchema),
    shouldUnregister: false,
  });

  const buildEmailTemplate = (t: any) => {
    return `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff;  padding:0px; ">
      <tr>
        <td style="font-size:16px; color:#333333; line-height:1.6;">
          
          <p style="padding:0 0 10px 0;">
            ${t("emailMessage1")}
          </p>

          <p style="margin:0 0 20px 0;">
            ${t("emailMessage2")} 
            <strong>${estimateHail?.estimateNumber} </strong> ${t("emailMessage3")}
            <strong>${estimateHail?.createdAt && format(new Date(estimateHail?.createdAt), "dd-MM-yyyy")}</strong> ${t("emailMessage4")} 
            <strong>${estimateHail?.currency && estimateHail?.currency} ${toDecimal(estimateHail?.total)}</strong>.
          </p>

          <p style="margin:0 0 20px 0;">
            ${t("emailMessage5")} 
          </p>

          <p style="margin:30px 0 0 0;">
           ${t("emailMessage6")}<br/>
            <strong>${companyData?.name}  </strong>
          </p>

        </td>
      </tr>
    </table>
  </body>
</html> `;
  };

  const currency = form.watch("currency");
  const panels = form.watch("estimateHailPanel") as Panel[];

  const totalDents = useMemo(
    () =>
      panels?.reduce((acc: number, item: Panel) => {
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
      }, 0),
    [panels],
  );

  const carBody = form.watch("carBody");

  const { fields: estimateHailPanel, update: updatePanel } = useFieldArray({
    control: form.control,
    name: "estimateHailPanel",
  });

  const newTotal = (estimateHail.total / 100).toFixed(2);
  const retainedPrice = (Number(estimateHail.retainedPrice) / 100).toFixed(2);

  const removeInstallPrice =
    Number(form.watch("removeInstall")) > 0 ? form.watch("removeInstall") : 0;

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

  const { data: companyAvatar, isLoading: isLoadingCompanyAvatar } = useQuery({
    queryKey: [QUERY_KEYS.companyAvatar],
    queryFn: () => getCompanyAvatar(),
  });

  const estimateDate =
    estimateHail?.createdAt !== undefined
      ? formatISO(new Date(estimateHail?.createdAt), { representation: "date" })
      : "";

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

  return (
    <div key={locale}>
      <div>
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-end gap-2 py-2"></div>
          <Form {...form}>
            <form className="w-full">
              <div className="flex justify-between py-1">
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
              <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="flex flex-col">
                  <h3 className="rounded-t-xl bg-gray-200 py-2 pl-5">
                    Vehicle
                  </h3>
                  <div className="flex items-center gap-1 md:gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-bl-xl bg-blue-50 md:h-32 md:w-32 md:p-5">
                      {estimateHail?.vehicle?.make && (
                        <Image
                          src={`https://www.carlogos.org/logo/${estimateHail?.vehicle?.make}-logo.png`}
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
                          {estimateHail?.vehicle?.make &&
                            estimateHail?.vehicle?.make}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
                        <div className="text-sm font-medium text-gray-300 md:text-base">
                          {tGarage("model")}
                        </div>
                        <div className="col-span-3 flex justify-start text-sm font-medium text-black sm:col-span-1 md:text-base">
                          {estimateHail?.vehicle?.model &&
                            estimateHail?.vehicle?.model}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm sm:grid-cols-2 md:text-base">
                        <div className="font-medium text-gray-300">
                          {tGarage("vin")}
                        </div>
                        <div className="col-span-3 flex items-start text-sm font-medium text-black sm:col-span-1 md:text-base">
                          {estimateHail?.vehicle?.vinNumber &&
                            estimateHail?.vehicle?.vinNumber}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
                        <div className="text-sm font-medium text-gray-300 md:text-base">
                          {tGarage("year")}
                        </div>
                        <div className="col-span-3 flex items-start text-sm font-medium text-black sm:col-span-1 md:text-base">
                          {estimateHail?.vehicle?.year &&
                            estimateHail?.vehicle?.year}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
                        <div className="text-nowrap text-sm font-medium text-gray-300 md:text-base">
                          {t("registrationNumber")}
                        </div>
                        <div className="col-span-3 flex items-start text-sm font-medium text-black sm:col-span-1 md:text-base">
                          {estimateHail?.vehicle?.registrationNumber &&
                            estimateHail?.vehicle?.registrationNumber}
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
                          {estimateHail?.client?.name &&
                            estimateHail?.client?.name}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-start text-center text-sm font-medium text-black md:text-base">
                          {estimateHail?.client?.address &&
                            estimateHail?.client?.address}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start text-nowrap text-center text-sm font-medium text-black md:text-base">
                          {estimateHail?.client?.city &&
                            estimateHail?.client?.city}
                          ,{" "}
                          {estimateHail?.client?.country &&
                            estimateHail?.client?.country}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-none md:flex-row">
                <div className="flex flex-col">
                  <div
                    key={`${id}`}
                    ref={svgRef}
                    className={`relative max-w-[${viewportWidth}] py-4 md:w-[420px]`}
                  >
                    <img
                      src={getVehicleBody(carBody as CarBody)}
                      alt={`car-image${getVehicleBody(carBody as CarBody)}`}
                      width={420}
                      height={560}
                      crossOrigin="anonymous"
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
                <div className="flex flex-col md:py-4">
                  <div className="pb-4">
                    <h3 className="border-b font-semibold">{t("rAndI")}</h3>
                    <h4 className="flex items-center">
                      {currency} {(Number(removeInstallPrice) / 100).toFixed(2)}
                    </h4>
                  </div>
                  <div>
                    {estimateHailPanel.map((panel, index) => {
                      const panelName = form.watch(
                        `estimateHailPanel.${index}`,
                      );
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 py-4">
                <div className="flex items-start gap-1">
                  <p> {t("total")}: </p>
                  <div className="flex items-center justify-center">
                    {currency} {newTotal}
                  </div>
                </div>
                <div className="flex items-start gap-1">
                  <p> {t("retainedPrice")}: </p>
                  <div className="flex items-center justify-center">
                    {currency} {retainedPrice}
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

export default EstimateHailFranceViewV2;
