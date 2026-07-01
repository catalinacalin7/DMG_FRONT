"use client";

import {
  Search,
  Check,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  AlarmCheck,
  XIcon,
  DownloadIcon,
  Send,
} from "lucide-react";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import LoadingScreen from "@/components/LoadingScreen";
import {
  changeEstimateStatus,
  deleteHailEstimate,
  downloadEstimate,
  EstimateDownload,
  EstimateHail,
  EstimateStatus,
  getHailEstimates,
  SendEstimate,
  sendPdfEstimate,
} from "@/api/estimates/estimates";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { getClientsFor } from "@/api/client/get-all";
import { toDecimal } from "@/utils/numberUtils";

import { useLocale, useTranslations } from "next-intl";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import DefaultTextInput from "@/components/inputs/DefaultTextInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { getCompany } from "@/api/company/company";

export const EstimateStatusList = [
  { label: "allEstimates", value: "ALL" },
  { label: "approved", value: "approved" },
  { label: "waitingApprove", value: "waiting_approve" },
  { label: "invoiced", value: "invoiced" },
  { label: "declined", value: "declined" },
];

const sendPdfSchema = yup.object().shape({
  email: yup.string().email("Email must be a valid email").required(),
  subject: yup.string(),
  message: yup.string(),
});
type SendPdfSchemaType = yup.InferType<typeof sendPdfSchema>;

type EstimateStatusType = "ALL" | "approved" | "waiting_approve" | "declined";

const EstimatesList = () => {
  const t = useTranslations("PageEstimates");
  const tActions = useTranslations("ToastActions");
  const tUI = useTranslations("ui");
  const tGarage = useTranslations("Garage");
  const tClient = useTranslations("PageClients");
  const tCarPanelStatus = useTranslations("CarPanelStatus");
  const tCompanyPayment = useTranslations("Settings.CompanyPayment");
  const tMatrix = useTranslations("Settings.Matrix");
  const router = useRouter();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [estimateItem, setEstimateItem] = useState<EstimateHail | null>(null);
  const [clientId, setClientId] = useState("");
  const [estimateStatus, setEstimateStatus] =
    useState<EstimateStatusType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDebounced] = useDebounce(searchQuery, 2000);
  const canResetFilters = searchQuery || estimateStatus !== "ALL" || clientId;
  const queryClient = useQueryClient();

  const locale = useLocale();

  const emailMessages = {
    message1: t("emailMessage1"),
    message2: t("emailMessage2"),
    message3: t("emailMessage3"),
    message4: t("emailMessage4"),
    message5: t("emailMessage5"),
    message6: t("emailMessage6"),
  } as const;

  type EmailMessage = typeof emailMessages;

  const pdfLabels = {
    estimateTitle: t("estimate"),
    make: tGarage("make"),
    model: tGarage("model"),
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
    panelStatus: tCarPanelStatus("panelStatus"),
    pdr: tCarPanelStatus("pdr"),
    repairAndPaint: tCarPanelStatus("repairAndPaint"),
    change: tCarPanelStatus("change"),
    noDamage: tCarPanelStatus("noDamage"),
    hOff: tCarPanelStatus("hOff"),
    panel: t("panel"),
    impacts: t("impact"),
    comments: t("comments"),
    technicalDents: tMatrix("technicalDents"),
    technicalDentsAbr: t("technicalDentsAbr"),
    removeInstall: t("rAndI"),
    dentsCount: 0,
    dentSize: t("dentSize"),
    lightDents: t("lightDents"),
    mediumDents: t("mediumDents"),
    strongDents: t("strongDents"),
  };

  const { data: companyData, isLoading: isLoadingCompanyData } = useQuery({
    queryKey: [QUERY_KEYS.companyInfo],
    queryFn: () => getCompany(),
  });

  const buildEmailTemplate = (
    estimate: EstimateHail,
    companyName: string,
    emailMessages: EmailMessage,
  ) => {
    return `<!DOCTYPE html>
  <html>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff;  padding:0px; ">
        <tr>
          <td style="font-size:16px; color:#333333; line-height:1.6;">
            
            <p style="padding:0 0 10px 0;">
              ${emailMessages.message1}
            </p>
  
            <p style="margin:0 0 20px 0;">
                           ${emailMessages.message2}

              <strong>${estimate?.estimateNumber} </strong>${emailMessages.message3}
            <strong>${estimate?.createdAt && format(new Date(estimate?.createdAt), "dd-MM-yyyy")}</strong>
            ${emailMessages.message4}

              <strong>${estimate?.currency && estimate?.currency} ${toDecimal(estimate?.total)}</strong>.
            </p>
  
            <p style="margin:0 0 20px 0;">
                            ${emailMessages.message5}

            </p>
  
            <p style="margin:30px 0 0 0;">
             ${emailMessages.message6}<br/>
              <strong>${companyName}</strong>
            </p>
  
          </td>
        </tr>
      </table>
    </body>
  </html> `;
  };

  const formSendPdf = useForm<SendPdfSchemaType>({
    defaultValues: {
      email: "",
      subject: "",
      message: "",
    },
    resolver: yupResolver(sendPdfSchema),
    shouldUnregister: false,
  });

  const sendPdfMutation = useMutation({
    mutationFn: async (values: SendEstimate) => {
      await sendPdfEstimate(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["send-pdf"],
      });
      toast.success(t("estimate"), {
        description: tActions("sent"),
      });
      formSendPdf.reset();

      setDialogOpen(false);
    },
    onError: () => {
      toast.error(t("estimate"), {
        description: tActions("somethingWentWrong"),
      });
      formSendPdf.reset();
      setDialogOpen(false);
    },
  });

  const {
    data: estimates,
    isLoading: isLoadingEstimates,
    refetch: refetchEstimates,
  } = useQuery({
    queryKey: [QUERY_KEYS.getHailEstimates],
    queryFn: async () =>
      await getHailEstimates({
        searchQuery: searchQueryDebounced,
        status: estimateStatus === "ALL" ? "" : estimateStatus,
        clientId: clientId,
      }),
  });

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => await getClientsFor(),
  });

  const deleteEstimate = useMutation({
    mutationFn: async (id: string) => {
      await deleteHailEstimate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getHailEstimates],
      });
      toast.success(t("estimate"), {
        description: tActions("deleted"),
      });
    },
    onError: () => {
      toast.error(t("estimate"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const estimateStatusMutation = useMutation({
    mutationFn: async ({ data, id }: { data: EstimateStatus; id: string }) => {
      await changeEstimateStatus(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getHailEstimates],
      });
      toast.success(t("estimate"), {
        description: tActions("updated"),
      });
    },
    onError: () => {
      toast.error(t("estimate"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const downloadEstimateMutation = useMutation({
    mutationFn: async (estimate: EstimateDownload) => {
      await downloadEstimate(estimate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      toast.success(t("estimate"), {
        description: tActions("downloaded"),
      });
    },
    onError: () => {
      toast.error(t("estimate"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteEstimate.mutate(id);
  };
  const resetFilters = () => {
    setSearchQuery("");
    setEstimateStatus("ALL");
    setClientId("");
  };

  useEffect(() => {
    refetchEstimates();
  }, [searchQueryDebounced, estimateStatus, clientId, refetchEstimates]);

  if (isLoadingEstimates) return <LoadingScreen />;
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:gap-2">
        <FormInputWrapper>
          <Input
            type="search"
            className="h-10 rounded-md"
            placeholder={tUI("placeholders.search")}
            startIcon={<Search className="text-gray-300" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <Select
            value={estimateStatus}
            onValueChange={(value: EstimateStatusType) =>
              setEstimateStatus(value)
            }
          >
            <SelectTrigger size="md">
              <SelectValue placeholder={tUI("placeholders.filterByStatus")} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {EstimateStatusList.map((status, index) => {
                  return (
                    <SelectItem key={index} value={status.value}>
                      {t(status.label)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormInputWrapper>
        <FormInputWrapper>
          <Select
            value={clientId}
            onValueChange={(value) => setClientId(value)}
          >
            <SelectTrigger size="md">
              <SelectValue placeholder={tUI("placeholders.filterByClient")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {clients?.map((client, index) => {
                  return (
                    <SelectItem key={index} value={client.id ?? ""}>
                      {client.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormInputWrapper>
        <div className="flex items-center justify-end md:col-span-1">
          <div className="flex-row-revers flex w-full items-center md:flex-row">
            {canResetFilters && (
              <Button
                variant="ghost"
                className="text-blue-300"
                type="button"
                onClick={resetFilters}
              >
                {tUI("buttons.resetFilters")}
              </Button>
            )}
          </div>
          <Button
            type="button"
            size="lg"
            onClick={() => router.push("/estimates/hail/estimate-france")}
          >
            {tUI("buttons.create")}
          </Button>
        </div>
      </div>

      {estimates?.length === 0 && (
        <p>{t("noEstimatesMatchYourSearch/filterCriteria")}.</p>
      )}

      <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-1">
        {estimates?.map((estimate) => {
          const currentStatus = EstimateStatusList.find(
            (item) => item.value === estimate.status,
          );
          return (
            <div
              key={estimate.id}
              className="flex w-full flex-col items-center justify-between gap-2 rounded-xl border p-4 lg:flex-row"
            >
              <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                  <small className="pb-1">{t("estimateNumber")}</small>

                  <div className="flex items-center text-base font-medium text-black">
                    {estimate.estimateNumber}
                  </div>
                </div>
                <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                  <small className="pb-1">{t("vin")}</small>
                  <div className="flex items-center text-base font-medium text-black">
                    {estimate.vehicle?.vinNumber}
                  </div>
                </div>
                <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                  <div className="flex items-center">
                    <small className="pb-1">{t("vehicle")}</small>
                  </div>
                  <div className="flex items-center text-base font-medium text-black">
                    <h3>
                      {estimate.vehicle?.make} {estimate.vehicle?.model}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                  <small className="pb-1">{t("status")}</small>
                  <h3 className="text-green flex items-center text-base font-medium">
                    {t(currentStatus?.label as string)}
                  </h3>
                </div>
                <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                  <small className="pb-1">Estimate Mode</small>
                  <h3 className="text-green flex items-center text-base font-medium">
                    {estimate.estimateMode}
                  </h3>
                </div>
                <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                  <small className="pb-1">{t("price")}</small>
                  <h3 className="text-brand-dark flex items-center text-base font-medium">
                    {toDecimal(estimate.total)}
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() =>
                    estimateStatusMutation.mutate({
                      data: { status: "approved" },
                      id: estimate.id as string,
                    })
                  }
                >
                  <Check className="h-4 text-green-500" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() =>
                    estimateStatusMutation.mutate({
                      data: { status: "waiting_approve" },
                      id: estimate.id as string,
                    })
                  }
                >
                  <AlarmCheck className="h-4 text-slate-500" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() =>
                    estimateStatusMutation.mutate({
                      data: { status: "declined" },
                      id: estimate.id as string,
                    })
                  }
                >
                  <XIcon className="h-4 text-red-500" />
                </Button>
                <DropdownMenu key={estimate?.id}>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary">
                      <EllipsisVerticalIcon className="h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/estimates/${estimate.id}/view`)
                        }
                      >
                        <EyeIcon className="mr-2 h-4 text-slate-500" />
                        {tUI("buttons.view")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          router.push(`/estimates/${estimate.id}/edit`);
                        }}
                      >
                        <PencilIcon className="mr-2 h-4 text-slate-500" />
                        {tUI("buttons.edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const tranlatedPanels =
                            estimate?.estimateHailPanel.map((item, index) => {
                              return {
                                ...item,
                                panel: t(item.panel),
                                estimatePanelLabel:
                                  item?.estimatePanelLabel?.length > 0
                                    ? item?.estimatePanelLabel?.map((label) => {
                                        return {
                                          label: t(label.label),
                                        };
                                      })
                                    : item?.estimatePanelLabel,
                              };
                            });
                          const estimateObj = {
                            ...estimate,
                            estimateHailPanel: tranlatedPanels,
                          };

                          downloadEstimateMutation.mutate({
                            id: estimate.id as string,
                            estimate: {
                              estimate: estimateObj,
                              pdfLables: pdfLabels,
                            },
                          });
                        }}
                      >
                        <DownloadIcon className="mr-2 h-4 text-slate-500" />
                        {tUI("buttons.download")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          setEstimateItem(estimate);
                          setDialogOpen(true);
                        }}
                      >
                        <Send className="mr-2 h-4 text-slate-500" />
                        {tUI("buttons.sendEmail")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        key={"delete"}
                      >
                        <Dialog>
                          <DialogTrigger asChild className="cursor-pointer">
                            <Button
                              variant="ghost"
                              className="-ml-3 flex h-6 w-full justify-start"
                            >
                              <TrashIcon className="mr-2 h-6 text-red-500" />
                              {tUI("buttons.delete")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="text-center">
                                {t("deleteHailEstimate")}
                              </DialogTitle>
                              <DialogDescription className="py-6 text-center text-base">
                                {t("areYouSureYouWantDeleteThisEstimate?")}
                              </DialogDescription>
                            </DialogHeader>

                            <DialogFooter className="flex flex-row items-center justify-center gap-2 py-8 sm:flex sm:justify-center">
                              <DialogClose asChild>
                                <Button
                                  type="button"
                                  variant={"secondary"}
                                  size={"sm"}
                                >
                                  {tUI("buttons.cancel")}
                                </Button>
                              </DialogClose>
                              <Button
                                type="button"
                                variant={"destructive"}
                                size={"sm"}
                                onClick={() => {
                                  handleDelete(estimate.id as string);
                                  setDialogOpen(false);
                                }}
                              >
                                {tUI("buttons.delete")}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div>
                  <Dialog
                    open={isDialogOpen}
                    onOpenChange={(value) => {
                      setDialogOpen(value);
                    }}
                    key={estimate.id}
                  >
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          {" "}
                          {t("sendPdf")}
                        </DialogTitle>
                        <DialogDescription className="py-6 text-center text-base"></DialogDescription>
                      </DialogHeader>
                      <Form {...formSendPdf}>
                        <form>
                          <div className="flex flex-col gap-4">
                            <DefaultTextInput
                              fieldName="email"
                              fieldLabel={t("email")}
                            />
                            <div>{t("emailSubject")}</div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: buildEmailTemplate(
                                  estimateItem,
                                  companyData?.name,
                                  emailMessages,
                                ),
                              }}
                            />
                          </div>
                          <DialogFooter className="flex flex-row items-center justify-center gap-2 py-8 sm:flex sm:justify-center">
                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant={"secondary"}
                                size={"sm"}
                              >
                                {tUI("buttons.cancel")}
                              </Button>
                            </DialogClose>
                            <Button
                              type="submit"
                              variant={"default"}
                              size={"sm"}
                              onClick={() => {
                                const email = formSendPdf.watch("email");
                                const tranlatedPanels =
                                  estimateItem?.estimateHailPanel.map(
                                    (item, index) => {
                                      return {
                                        ...item,
                                        panel: t(item.panel),
                                        estimatePanelLabel:
                                          item?.estimatePanelLabel?.length > 0
                                            ? item?.estimatePanelLabel?.map(
                                                (label) => {
                                                  return {
                                                    label: t(label.label),
                                                  };
                                                },
                                              )
                                            : item?.estimatePanelLabel,
                                      };
                                    },
                                  );
                                const estimateObj = {
                                  ...estimateItem,
                                  estimateHailPanel: tranlatedPanels,
                                };
                                sendPdfMutation.mutate({
                                  email: {
                                    emailAddress: email,
                                    subject: t("emailSubject"),
                                    message: buildEmailTemplate(
                                      estimateItem,
                                      companyData?.name,
                                      emailMessages,
                                    ),
                                  },
                                  estimate: {
                                    estimate: estimateObj,
                                    pdfLables: pdfLabels,
                                  },
                                });
                                setDialogOpen(false);
                                setEstimateItem(null);
                              }}
                            >
                              {tUI("buttons.send")}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EstimatesList;
