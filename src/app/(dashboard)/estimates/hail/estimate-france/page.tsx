"use client";

import EstimateHailFranceFormV2 from "@/features/estimates/EstimateHailFranceFormV2";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getCompany } from "@/api/company/company";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/components/LoadingScreen";

const EstimateManualPage = () => {
  const { data: companyData, isLoading: isLoadingCompanyData } = useQuery({
    queryKey: [QUERY_KEYS.companyInfo],
    queryFn: () => getCompany(),
  });
  if (isLoadingCompanyData) return <LoadingScreen />;
  return <EstimateHailFranceFormV2 companyData={companyData} />;
};

export default EstimateManualPage;
