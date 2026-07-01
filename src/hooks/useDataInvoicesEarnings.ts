"use client";

import { getInvoicesFor } from "@/api/home-dashboard/home-dashboard";
import { getInvoices, InvoiceResponse } from "@/api/invoices/invoices";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type chartDataEarningsType = {
  status: string;
  count: number;
};
export const Earnings_Options = {
  open: "open",
  closed: "closed",
} as const;

export type Earnings = keyof typeof Earnings_Options;

export const useDataInvoicesEarnings = () => {
  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoice,
  } = useQuery<InvoiceResponse[]>({
    queryKey: ["invoices"],
    queryFn: async () => await getInvoicesFor("", "", ""),
  });



  return useMemo(() => {
    const statusCountMap = invoices?.reduce(
      (acum, item: InvoiceResponse) => {
        acum[item.status] = (acum[item.status] || 0) + 1;
        return acum;
      },
      {} as Record<string, number>,
    );
    const chartData: chartDataEarningsType[] = statusCountMap
      ? Object.entries(statusCountMap).map(([status, count]) => {
        return { status: "open", count: 2 };
      })
      : [];

    return {
      data: chartData,
      isLoading: isLoadingInvoices,
      refetch: refetchInvoice,
    };
  }, [invoices, isLoadingInvoices, refetchInvoice]);
};
