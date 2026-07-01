"use client";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { getInvoices, InvoiceResponse } from "@/api/invoices/invoices";
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
import { useTranslations } from "next-intl";

import { InvoiceStatusList } from "@/features/invoices/InvoicesList/InvoicesList";
import { toDecimal } from "@/utils/numberUtils";
import { cn } from "@/utils/cn";
import { getInvoicesFor } from "@/api/home-dashboard/home-dashboard";
import { useRouter } from "@/i18n/navigation";

const InvoicesDesktop = () => {
  const router = useRouter();
  const t = useTranslations("PageHome");
  const tInvoices = useTranslations("PageInvoices");

  const [invoiceStatus, setInvoiceStatus] = useState<string>("ALL");

  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoice,
  } = useQuery<InvoiceResponse[]>({
    queryKey: ["invoices-list"],
    queryFn: async () =>
      await getInvoicesFor(
        "",
        invoiceStatus === "ALL" ? "" : invoiceStatus,
        "",
      ),
  });

  useEffect(() => {
    refetchInvoice();
  }, [refetchInvoice, invoiceStatus]);

  return (
    <div className="bg-background flex flex-col gap-6 rounded-xl border border-solid border-[#E6EDFF] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">{tInvoices("invoicesList")}</h2>

        <Select onValueChange={(value) => setInvoiceStatus(value)}>
          <SelectTrigger className="h-[26px] w-fit border-none shadow-md">
            <SelectValue placeholder={tInvoices("allInvoices")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              {InvoiceStatusList?.map((status, index) => {
                return (
                  <SelectItem key={index} value={status.value}>
                    {tInvoices(status.value)}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("no")}</TableHead>
            <TableHead>{tInvoices("invoice")}</TableHead>
            <TableHead>{tInvoices("status")}</TableHead>
            <TableHead>{tInvoices("client")}</TableHead>
            <TableHead>{tInvoices("amountDue")}</TableHead>
            <TableHead>{tInvoices("createInvoice")}</TableHead>

            <TableHead className="text-center">{t("action")}</TableHead>
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

                <TableCell
                  className={cn("text-x font-semibold", {
                    "text-orange-400": invoice.status === "closed",
                    "text-brand-dark": invoice.status === "open",
                  })}
                >
                  {tInvoices(invoice.status)}
                </TableCell>

                <TableCell>{invoice.client.name}</TableCell>

                <TableCell className="text-brand-dark font-semibold">
                  €{toDecimal(invoice.amountDue - invoice.discount)}
                </TableCell>
                <TableCell className="font-semibold text-black">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <button
                    className="mx-auto block rounded-full p-1 transition-all hover:bg-gray-100"
                    onClick={() => router.push(`/invoices/${invoice.id}`)}
                  >
                    <Eye size={18} className="text-muted-foreground" />
                  </button>
                </TableCell>

                {/* <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="mx-auto block rounded-full p-1 transition-all hover:bg-muted">
                        <Ellipsis />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 border-none shadow-md">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/invoices/${invoice.id}`)
                        }
                      >
                        <EyeIcon className="mr-2 h-4 text-slate-500" />
                        {tUI("buttons.view")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell> */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesDesktop;
