"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { getInvoices, InvoiceResponse } from "@/api/invoices/invoices";
import { useQuery } from "@tanstack/react-query";
import { getInvoicesFor } from "@/api/home-dashboard/home-dashboard";

export type chartDataType = {
  label: string;
  openInvoices: number;
  closedInvoices: number;
};
export type periodType = "weekly" | "monthly";

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const weekDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const getLabel = (date: Date, period: periodType) => {
  switch (period) {
    case "monthly":
      return date.toLocaleString("en-US", { month: "long" }).toLowerCase();
    case "weekly":
      return date
        .toLocaleString("en-US", { weekday: "long" })
        .toLowerCase()
        .slice(0, 3);
  }
};

export const useDataInvoicesAnalytics = (period: periodType = "monthly") => {
  const tDate = useTranslations("Date");
  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoice,
  } = useQuery<InvoiceResponse[]>({
    queryKey: ["invoices"],
    queryFn: async () => await getInvoicesFor("", "", ""),
  });
  return useMemo(() => {
    const stats: Record<string, { open: number; closed: number }> = {};

    invoices?.forEach(({ createdAt, status }) => {
      const label = getLabel(new Date(createdAt), period);
      stats[label] ??= { open: 0, closed: 0 };
      if (status === "open") stats[label].open += 1;
      if (status === "closed") stats[label].closed += 1;
    });

    const labels =
      period === "monthly" ? monthNames : period === "weekly" ? weekDays : [];

    return {
      data: labels.map((label) => {
        return {
          label: tDate(label),
          openInvoices: stats[label]?.open || 0,
          closedInvoices: stats[label]?.closed || 0,
        };
      }),
      isLoading: isLoadingInvoices,
      refetch: refetchInvoice,
    };
  }, [invoices, period, refetchInvoice]);
};
