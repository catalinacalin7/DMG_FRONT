"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "../api/client/get-all";
import { getMembers } from "@/api/company/members";
import { getInvoices, InvoiceResponse } from "@/api/invoices/invoices";
import { EstimateHail, getHailEstimates } from "@/api/estimates/estimates";

import { Briefcase, Calculator, ReceiptText, UsersRound } from "lucide-react";

import { BusinessClientData, PrivateClientData } from "@/types/clients";
import { MemberDto } from "@/types/company";
import { ClientData, getClientsFor, getEstimatesFor, getInvoicesFor, getMembersFor } from "@/api/home-dashboard/home-dashboard";

type DataSnapshot = {
  totalClients: number;
  totalEmployees: number;
  totalEstimates: number;
  totalInvoices: number;
};
type StatsCardData = {
  name: keyof DataSnapshot;
  value: number;
  icon:
  | typeof UsersRound
  | typeof Briefcase
  | typeof Calculator
  | typeof ReceiptText;
  change: number;
  percentage: string;
  trend: "up" | "down" | "neutral";
};

const mockDataDefault: StatsCardData[] = [
  {
    name: "totalClients",
    value: 1,
    icon: UsersRound,
    change: 0,
    percentage: "",
    trend: "neutral",
  },
  {
    name: "totalEmployees",
    value: 2,
    icon: Briefcase,
    change: 0,
    percentage: "",
    trend: "neutral",
  },
  {
    name: "totalEstimates",
    value: 4,
    icon: Calculator,
    change: 0,
    percentage: "",
    trend: "neutral",
  },
  {
    name: "totalInvoices",
    value: 0,
    icon: ReceiptText,
    change: 0,
    percentage: "",
    trend: "neutral",
  },
];

export const useDataStatsCardsData = () => {
  const {
    data: clients,
    isLoading: isLoadingClients,
    refetch: clientsRefetch,
  } = useQuery<ClientData[]>({
    queryKey: ["clients-cards"],
    queryFn: getClientsFor,
  });

  const {
    data: employees,
    isLoading: isLoadingEmployees,
    refetch: employeesRefetch,
  } = useQuery<MemberDto[]>({
    queryKey: ["employees-cards"],
    queryFn: getMembersFor,
  });
  const {
    data: estimates,
    isLoading: isLoadingEstimates,
    refetch: estimatesRefetch,
  } = useQuery<EstimateHail[]>({
    queryKey: ["estimates-cards"],
    queryFn: () => getEstimatesFor({}),
  });

  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    refetch: invoicesRefetch,
  } = useQuery<InvoiceResponse[]>({
    queryKey: ["invoices-cards"],
    queryFn: () => getInvoicesFor("", "", ""),
  });

  const dataSnapshot: DataSnapshot = useMemo(
    () => ({
      totalClients: clients?.length ?? 0,
      totalEmployees: employees?.length ?? 0,
      totalEstimates: estimates?.length ?? 0,
      totalInvoices: invoices?.length ?? 0,
    }),
    [clients, employees, estimates, invoices],
  );
  const isLoading =
    isLoadingClients ||
    isLoadingEmployees ||
    isLoadingEstimates ||
    isLoadingInvoices;

  const formattedMockData = useMemo(
    () =>
      mockDataDefault.map((item) => {
        const previousValue = item.value;
        const currentValue = dataSnapshot[item.name] ?? item.value;
        const change = currentValue - previousValue;
        const percentage =
          previousValue === 0 ? 0 : (change / previousValue) * 100;
        return {
          ...item,
          value: currentValue,
          change: Number(change.toFixed(1)),
          percentage: `${change > 0 ? "+ " : " "}${percentage.toFixed(0)}%`,
          trend: change > 0 ? "up" : change < 0 ? "down" : "neutral",
        };
      }),
    [dataSnapshot],
  );
  return {
    data: formattedMockData,
    isLoading,
    refetch: () => {
      clientsRefetch();
      employeesRefetch();
      estimatesRefetch();
      invoicesRefetch();
    },
  };
};
