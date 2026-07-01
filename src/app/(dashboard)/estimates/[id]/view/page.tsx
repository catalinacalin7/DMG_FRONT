"use client";

import { getCompany, getCompanyPayment } from "@/api/company/company";
import { getHailEstimateById } from "@/api/estimates/estimates";
import LoadingScreen from "@/components/LoadingScreen";
import { QUERY_KEYS } from "@/constants/queryKeys";
import EstimateHailFranceViewV2 from "@/features/estimates/EstimateHailFranceViewV2";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

function ViewHailEstimate() {
  const { id } = useParams();

  const { data: companyData, isLoading: isLoadingCompanyData } = useQuery({
    queryKey: [QUERY_KEYS.companyInfo],
    queryFn: () => getCompany(),
  });

  // const { data: companyPaymentData, isLoading: isLoadingCompanyPaymentData } =
  //   useQuery({
  //     queryKey: [QUERY_KEYS.companyPayment],
  //     queryFn: () => getCompanyPayment(),
  //   });

  const { data: estimateHail, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.getHailEstimate, id],
    queryFn: () => getHailEstimateById(id as string),
    enabled: !!id,
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <EstimateHailFranceViewV2
      companyData={companyData}
      // companyPayment={companyPaymentData}
      estimateHail={estimateHail}
      vehicleType={estimateHail?.vehicle?.vehicleType}
    />
  );
}
export default ViewHailEstimate;
