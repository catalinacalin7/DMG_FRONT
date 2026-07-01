"use client";

import { EllipsisVerticalIcon, Euro, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { estimatesByVehicelId } from "@/api/estimates/estimates";
import { useParams } from "next/navigation";
import { toDecimal } from "@/utils/numberUtils";
import LoadingScreen from "@/components/LoadingScreen";
import { EstimateStatusList } from "@/features/estimates/EstimatesList";

import { invoicesByVehicelId } from "@/api/invoices/invoices";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { useRouter } from "@/i18n/navigation";

const HistoryTab = () => {
  const t = useTranslations("PageEstimates");
  const tInvoices = useTranslations("PageInvoices");
  const tUI = useTranslations("ui");
  const router = useRouter();

  const { vehicleId } = useParams();

  const { data: estimates, isLoading: isLoadingEstimates } = useQuery({
    queryKey: [QUERY_KEYS.getEstimatesByVehicleId],
    queryFn: async () => await estimatesByVehicelId(vehicleId as string),
  });

  const { data: invoice, isLoading: isLoadingInvoices } = useQuery({
    queryKey: [QUERY_KEYS.getInvoicesByVehicleId],
    queryFn: async () => await invoicesByVehicelId(vehicleId as string),
  });

  console.log(invoice);
  if (isLoadingEstimates || isLoadingInvoices) return <LoadingScreen />;

  return (
    <TabsContent value="history" className="">
      <div className="">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="Estimates">
            <AccordionTrigger>Estimates</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-1">
                {estimates?.map((estimate) => {
                  const currentStatus = EstimateStatusList.find(
                    (item) => item.value === estimate.status,
                  );

                  return (
                    <div
                      key={estimate?.id}
                      className="flex w-full flex-col items-center justify-between gap-2 rounded-xl border p-4 lg:flex-row"
                    >
                      <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                        <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                          <small className="pb-1">{t("estimateNumber")}</small>

                          <div className="flex items-center text-base font-medium text-black">
                            {estimate?.estimateNumber}
                          </div>
                        </div>
                        <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                          <small className="pb-1">{t("vin")}</small>
                          <div className="flex items-center text-base font-medium text-black">
                            {estimate?.vehicle?.vinNumber}
                          </div>
                        </div>
                        <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                          <div className="flex items-center">
                            <small className="pb-1">{t("vehicle")}</small>
                          </div>
                          <div className="flex items-center text-base font-medium text-black">
                            <h3>
                              {estimate?.vehicle?.make}{" "}
                              {estimate?.vehicle?.model}
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
                            {estimate?.estimateMode}
                          </h3>
                        </div>
                        <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                          <small className="pb-1">{t("price")}</small>
                          <h3 className="flex items-center text-base font-medium text-blue-600">
                            {toDecimal(estimate?.total)}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="secondary">
                              <EllipsisVerticalIcon className="h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/estimates/${estimate.id}/view`)
                                }
                              >
                                <EyeIcon className="mr-2 h-4 text-slate-500" />
                                {tUI("buttons.view")}
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Invoices">
            <AccordionTrigger>Invoices</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {invoice &&
                invoice?.map((invoice) => {
                  return (
                    <div key={invoice?.id} className="flex flex-col gap-2">
                      <Card className="flex w-full flex-row p-4">
                        <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
                          <p className="flex flex-col text-xs font-light text-slate-400">
                            {tInvoices("invoice")}{" "}
                            <span className="font-bold text-black">
                              {`${invoice?.series}-${invoice?.number}`}
                            </span>
                          </p>

                          <p className="flex flex-col text-xs font-light text-slate-400">
                            {tInvoices("status")}
                            <span
                              className={cn("text-x font-semibold", {
                                "text-blue-600": invoice.status === "closed",
                                "text-green-600": invoice.status === "open",
                              })}
                            >
                              {tInvoices(invoice?.status)}
                            </span>
                          </p>

                          <p className="flex flex-col text-xs font-light text-slate-400">
                            {tInvoices("client")}
                            <span className="font-semibold text-black">
                              {invoice?.client?.name}
                            </span>
                          </p>

                          <p className="flex flex-col text-xs font-light text-slate-400">
                            {tInvoices("amountDue")}{" "}
                            <span className="flex items-start font-semibold text-blue-600">
                              <Euro size={15} />
                              {toDecimal(
                                invoice?.amountDue - invoice?.discount,
                              )}
                            </span>
                          </p>

                          <p className="flex flex-col text-xs font-light text-slate-400">
                            {tInvoices("createInvoice")}
                            <span className="font-semibold text-black">
                              {new Date(
                                invoice?.createdAt,
                              ).toLocaleDateString()}
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
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/invoices/${invoice.id}`)
                                  }
                                >
                                  <EyeIcon className="mr-2 h-4 text-slate-500" />
                                  {tUI("buttons.view")}
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    </div>
                  );
                })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </TabsContent>
  );
};

export default HistoryTab;
