"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DateRange } from "react-day-picker";

import { CloudDownload } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getInvoices, InvoiceResponse } from "@/api/invoices/invoices";
import { getAllClients, getClientsFor } from "@/api/client/get-all";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingScreen from "@/components/LoadingScreen";
import { DatePickerRange } from "@/components/DatePickerRange";

import { toDecimal } from "@/utils/numberUtils";
import { cn } from "@/utils/cn";

import { INVOICES_STATUS_TYPE } from "@/constants/invoices-type";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";

const InvoicesReports = () => {
  const t = useTranslations("PageHome");
  const tInvoices = useTranslations("PageInvoices");
  const tUI = useTranslations("ui");

  const [clientId, setClientId] = useState("");
  const [resetDate, setResetDate] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => await getClientsFor(),
  });

  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoice,
  } = useQuery<InvoiceResponse[]>({
    queryKey: ["invoices-list"],
    queryFn: async () =>
      await getInvoices("", INVOICES_STATUS_TYPE.closed, clientId),
  });

  useEffect(() => {
    refetchInvoice();
  }, [refetchInvoice, clientId]);

  const resetFilters = () => {
    setClientId("");
    setDateRange(undefined);
    setResetDate((prev) => !prev);
  };

  if (isLoadingInvoices) return <LoadingScreen />;

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
        <FormInputWrapper>
          <DatePickerRange
            onDataChange={setDateRange}
            resetTrigger={resetDate}
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <Select
            value={clientId}
            onValueChange={(value) => setClientId(value)}
          >
            <SelectTrigger size="md" className="w-full">
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

        <FormInputWrapper>
          {(clientId || dateRange) && (
            <Button
              variant="ghost"
              className="h-[45px] text-blue-300"
              type="button"
              onClick={resetFilters}
            >
              {tUI("buttons.resetFilters")}
            </Button>
          )}
        </FormInputWrapper>
        {/* <Button
            variant="outline"
            className="sm:text-sm"
            startIcon={<CloudDownload className="h-6 w-6 text-gray-300" />}
          >
            {tUI("buttons.download")}
          </Button> */}
      </div>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("no")}</TableHead>
              <TableHead>{tInvoices("invoice")}</TableHead>
              <TableHead>{tInvoices("createInvoice")}</TableHead>
              <TableHead>{tInvoices("status")}</TableHead>
              <TableHead>{tInvoices("client")}</TableHead>
              <TableHead className="text-center">
                {tInvoices("amountDue")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices &&
              invoices.map((invoice, index) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-bold text-black">
                    {index + 1}
                  </TableCell>

                  <TableCell className="font-bold text-black">
                    {`${invoice?.series}-${invoice?.number}`}
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell
                    className={cn("text-x font-semibold", {
                      "text-blue-600":
                        invoice.status === INVOICES_STATUS_TYPE.closed,
                      "text-green6300":
                        invoice.status === INVOICES_STATUS_TYPE.open,
                    })}
                  >
                    {tInvoices(invoice.status)}
                  </TableCell>

                  <TableCell>{invoice.client.name}</TableCell>

                  <TableCell className="text-center font-semibold text-blue-600">
                    €{toDecimal(invoice.amountDue - invoice.discount)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="block space-y-4 pt-4 md:hidden">
        {invoices &&
          invoices.map((invoice, index) => (
            <div
              key={invoice.id}
              className="flex w-full flex-col items-center justify-between gap-2 rounded-xl border p-4"
            >
              <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                <div className="flex justify-between border-b py-1">
                  <small className="pb-1">
                    {t("no")} {index + 1}
                  </small>
                </div>
                <div className="flex flex-row items-center justify-between border-b py-1">
                  <small>{tInvoices("invoice")}:</small>
                  <div className="text-base font-medium text-black">
                    {`${invoice?.series}-${invoice?.number}`}
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between border-b py-1">
                  <small>{tInvoices("createInvoice")}:</small>
                  <div className="text-base font-medium text-black">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between border-b py-1">
                  <small>{tInvoices("client")}:</small>
                  <h3 className="text-green text-base font-medium">
                    {invoice.client.name}
                  </h3>
                </div>
                <div className="flex flex-row items-center justify-between border-b py-1">
                  <small>{tInvoices("amountDue")}:</small>
                  <h3 className="text-base font-medium text-blue-600">
                    €{toDecimal(invoice.amountDue - invoice.discount)}
                  </h3>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default InvoicesReports;
