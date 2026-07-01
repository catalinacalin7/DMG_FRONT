"use client";

import { getCompany } from "@/api/company/company";
import LoadingScreen from "@/components/LoadingScreen";
import { QUERY_KEYS } from "@/constants/queryKeys";
import CreateInvoiceForm from "@/features/invoices/CreateInvoiceForm";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const CreateInvoicePage = () => {
  const { data: companyData, isLoading: isLoadingCompanyData } = useQuery({
    queryKey: [QUERY_KEYS.companyInfo],
    queryFn: () => getCompany(),
  });

  if (isLoadingCompanyData) return <LoadingScreen />;
  return <CreateInvoiceForm companyData={companyData} />;
};

export default CreateInvoicePage;
