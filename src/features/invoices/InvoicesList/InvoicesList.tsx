"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/dialog";
import * as yup from "yup";
import { Form } from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllClients, getClientsFor } from "@/api/client/get-all";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import {
  EllipsisVerticalIcon,
  PlusIcon,
  EyeIcon,
  CopyIcon,
  PencilIcon,
  PrinterIcon,
  DownloadIcon,
  MailIcon,
  TrashIcon,
  Euro,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";

import { Input } from "@/components/ui/input";
import {
  deleteInvoice,
  downloadInvoice,
  getInvoices,
  InvoiceResponse,
  SendInvoice,
  sendInvoice,
  updateInvoiceStatus,
} from "@/api/invoices/invoices";
import { useDebounce } from "use-debounce";

import { toast } from "sonner";
import { toDecimal } from "@/utils/numberUtils";
import { useTranslations } from "next-intl";
import { AxiosError } from "axios";
import { InvoiceStatus } from "@/types/invoices";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { Link, useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DefaultTextInput from "@/components/inputs/DefaultTextInput";
import { format } from "date-fns";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getCompany } from "@/api/company/company";
import { EstimateService } from "../CreateInvoiceForm";

function fromCents(amount: number): number {
  return amount / 100;
}

export const InvoiceStatusList = [
  { value: "DRAFT", label: "Draft" },
  { value: "ISSUED", label: "Issued" },
  { value: "SENT", label: "Sent" },
  { value: "PAID", label: "Paid" },
  { value: "ALL", label: "All" },
] as const;

const sendPdfSchema = yup.object().shape({
  email: yup.string().email("Email must be a valid email").required(),
  subject: yup.string(),
  message: yup.string(),
});

type SendPdfSchemaType = yup.InferType<typeof sendPdfSchema>;

const InvoicesList = () => {
  const t = useTranslations("PageInvoices");
  const tNavigation = useTranslations("Navigation");
  const tUI = useTranslations("ui");
  const tActions = useTranslations("ToastActions");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [clientId, setClientId] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDebounced] = useDebounce(searchQuery, 2000);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [invoiceItem, setInvoiceItem] = useState<InvoiceResponse | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const canResetFilters = searchQuery || invoiceStatus !== "ALL" || clientId;

  const { data: companyData, isLoading: isLoadingCompanyData } = useQuery({
    queryKey: [QUERY_KEYS.companyInfo],
    queryFn: () => getCompany(),
  });

  const invoiceLabelsTranslations = {
    invoice: t("invoice"),
    client: t("client"),
    supplier: t("supplier"),
    issueDate: t("issueDate"),
    dueDate: t("dueDate"),
    regNo: t("regNo"),
    taxID: t("taxID"),
    address: t("address"),
    iban: t("iban"),
    swift: t("swift"),
    phone: t("phone"),
    email: t("email"),
    shareCapital: t("shareCapital"),
    nr: t("nr"),
    serviceName: t("serviceName"),
    measuringUnit: t("measuringUnit"),
    quantity: t("quantity"),
    unitPrice: t("unitPrice"),
    price: t("price"),
    vat: t("VAT"),
    subtotal: t("subtotal"),
    total: t("total"),
    county: t("county"),
    country: t("country"),
  };

  const emailMessages = {
    message1: t("emailMessage1"),
    message2: t("emailMessage2"),
    message3: t("emailMessage3"),
    message4: t("emailMessage4"),
    message5: t("emailMessage5"),
    message6: t("emailMessage6"),
  } as const;

  type EmailMessage = typeof emailMessages;

  const buildEmailTemplate = (
    invoice: InvoiceResponse,
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
  
                <strong>${invoice?.series}-${String(invoice?.number).padStart(5, "0")} </strong>${emailMessages.message3}
              <strong>${invoice?.createdAt && format(new Date(invoice?.createdAt), "dd-MM-yyyy")}</strong>
              ${emailMessages.message4}
  
                <strong>${invoice?.currency && invoice?.currency} ${Number(toDecimal(invoice?.amountDue)).toFixed(2)}</strong>.
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

  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => await getClientsFor(),
  });

  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoice,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () =>
      await getInvoices(
        searchQueryDebounced,
        invoiceStatus === "ALL" ? "" : invoiceStatus,
        clientId,
      ),
  });

  const calculateAmountDue = (invoice: InvoiceResponse) =>
    invoice?.estimateService?.reduce((acc: number, item: EstimateService) => {
      let total = 0;
      total += item.price;
      if (invoice.isDiscount) {
        total = total - (total * invoice.discount) / 100;
      }
      total = total + (total * +invoice.vatPercentage) / 100;
      return acc + total;
    }, 0);

  const resetFilters = () => {
    setSearchQuery("");
    setInvoiceStatus("ALL");
    setClientId("");
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
    mutationFn: async (values: SendInvoice) => {
      await sendInvoice(values);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["send-pdf"],
      });
      // await updateInvoiceStatus(invoiceItem.id, InvoiceStatus.SENT);
      toast.success(t("invoice"), {
        description: tActions("sent"),
      });
      formSendPdf.reset();

      setDialogOpen(false);
    },
    onError: () => {
      toast.error(t("invoice"), {
        description: tActions("somethingWentWrong"),
      });
      formSendPdf.reset();
      setDialogOpen(false);
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteInvoice(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      toast.success(t("invoice"), {
        description: tActions("deleted"),
      });
    },
    onError: () => {
      toast.error(t("invoice"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const downloadInvoiceMutation = useMutation({
    mutationFn: async (id: string) => {
      await downloadInvoice({
        id: id,
        invoiceLabels: invoiceLabelsTranslations,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      toast.success(t("invoice"), {
        description: tActions("downloaded"),
      });
    },
    onError: () => {
      toast.error(t("invoice"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  // const sendInvoiceMutation = useMutation({
  //   mutationFn: async (id: string) => {
  //     await sendInvoice(id);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["invoices"],
  //     });
  //     toast.success(t("invoice"), {
  //       description: tActions("sent"),
  //     });
  //   },
  //   onError: (error: AxiosError<any>) => {
  //     // toast({
  //     //   title: "Send Invoice",
  //     //   description: error.response?.data?.message
  //     //     ? error.response?.data?.message
  //     //     : "There was a problem with your request.",
  //     //   variant: "destructive",
  //     //   duration: 3000,
  //     // });
  //   },
  // });

  useEffect(() => {
    refetchInvoice();
  }, [searchQueryDebounced, invoiceStatus, clientId, refetchInvoice]);

  if (isLoadingClients || isLoadingInvoices) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-3">
        <FormInputWrapper>
          <Input
            className="h-10 rounded-sm"
            type="search"
            placeholder={tUI("placeholders.searchInvoices")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FormInputWrapper>

        <FormInputWrapper>
          <Select
            value={invoiceStatus}
            onValueChange={(value: InvoiceStatus) => setInvoiceStatus(value)}
          >
            <SelectTrigger size="md">
              <SelectValue placeholder={tUI("placeholders.filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {InvoiceStatusList?.map((status, index) => {
                  return (
                    <SelectItem key={index} value={status.value}>
                      {t(status.value)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormInputWrapper>
        <FormInputWrapper>
          <div className="flex items-center justify-between gap-2">
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
            <Button asChild size="lg" type="button" className="">
              <Link href={`/invoices/create`}>
                <PlusIcon className="h-6! w-6!" />
              </Link>
            </Button>
          </div>
        </FormInputWrapper>
      </div>

      <div className="flex h-12 items-center justify-between">
        <p className="font-semibold">{tNavigation("invoices")}</p>
        {canResetFilters && (
          <Button
            variant="ghost"
            className="h-full text-blue-300"
            type="button"
            onClick={resetFilters}
          >
            {tUI("buttons.resetFilters")}
          </Button>
        )}
      </div>

      {invoices?.length === 0 && (
        <div>{t("noInvoicesMatchYourSearch/filterCriteria")}</div>
      )}
      <div className="flex flex-col gap-2">
        {invoices &&
          invoices.map((item, index) => {
            return (
              <Card key={index} className="flex w-full flex-row p-4">
                <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
                  <p className="flex flex-col text-xs font-light text-slate-400">
                    {t("invoice")}{" "}
                    <span className="font-bold text-black">
                      {item.series}-{String(item.number).padStart(5, "0")}
                    </span>
                  </p>

                  <p className="flex flex-col text-xs font-light text-slate-400">
                    {t("status")}
                    <span
                      className={cn("text-x font-semibold", {
                        "text-brand-dark": item.status === "closed",
                        "text-green-600": item.status === "open",
                      })}
                    >
                      {t(item.status)}
                    </span>
                  </p>

                  <p className="flex flex-col text-xs font-light text-slate-400">
                    {t("client")}
                    <span className="font-semibold text-black">
                      {item.client.name}
                    </span>
                  </p>

                  <p className="flex flex-col text-xs font-light text-slate-400">
                    {t("amountDue")}{" "}
                    <span className="text-brand-dark flex items-start font-semibold">
                      <Euro size={15} />
                      {fromCents(calculateAmountDue(item)).toFixed(2)}
                    </span>
                  </p>

                  <p className="flex flex-col text-xs font-light text-slate-400">
                    {t("createInvoice")}
                    <span className="font-semibold text-black">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-end self-start">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-5 w-5 bg-[#f5f5f5]"
                      >
                        <EllipsisVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white">
                      <DropdownMenuGroup>
                        {/* <DropdownMenuItem
                          onClick={() => router.push(`/invoices/${item.id}`)}
                        >
                          <EyeIcon className="mr-2 h-4 text-slate-500" />
                          {tUI("buttons.view")}
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/invoices/${item.id}/edit`)
                          }
                        >
                          <PencilIcon className="mr-2 h-4 text-slate-500" />
                          {tUI("buttons.edit")}
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                          <CopyIcon className="mr-2 h-4 text-slate-500" />
                          {tUI("buttons.copyInvoice")}
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onSelect={(e) => {
                            setInvoiceItem(item);
                            setDialogOpen(true);
                          }}
                        >
                          <MailIcon className="mr-2 h-4 text-slate-500" />
                          {tUI("buttons.sendEmail")}
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                          <PrinterIcon className="mr-2 h-4 text-slate-500" />
                          {tUI("buttons.print")}
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onClick={() => {
                            downloadInvoiceMutation.mutate(item.id as string);
                          }}
                        >
                          <DownloadIcon className="mr-2 h-4 text-slate-500" />
                          {tUI("buttons.download")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-100" />
                        <DropdownMenuItem
                          disabled={item?.status !== InvoiceStatus.DRAFT}
                          onSelect={(e) => {
                            setInvoiceId(item?.id);
                            setDialogOpen(true);
                          }}
                        >
                          <TrashIcon className="mr-2 h-4 text-red-500" />
                          {tUI("buttons.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          {tUI("buttons.deleteInvoice")}
                        </DialogTitle>
                        <DialogDescription className="py-6 text-center text-base">
                          {t("areYouSureYouWantToDeleteThisInvoice")}
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
                            deleteInvoiceMutation.mutate(invoiceId as string);
                            setInvoiceId(null);
                            setDialogOpen(false);
                          }}
                        >
                          {tUI("buttons.delete")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  <Dialog
                    open={isDialogOpen}
                    onOpenChange={(value) => {
                      setDialogOpen(value);
                    }}
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
                                  invoiceItem,
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

                                sendPdfMutation.mutate({
                                  id: invoiceItem.id,
                                  email: {
                                    emailAddress: email,
                                    subject: t("emailSubject"),
                                    message: buildEmailTemplate(
                                      invoiceItem,
                                      companyData?.name,
                                      emailMessages,
                                    ),
                                  },
                                  invoiceLabels: invoiceLabelsTranslations,
                                });
                                setDialogOpen(false);
                                setInvoiceItem(null);
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
              </Card>
            );
          })}
      </div>
    </>
  );
};

export default InvoicesList;
