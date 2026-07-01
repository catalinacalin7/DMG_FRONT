"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCompany,
  getCompanyAvatar,
  deleteAccount,
} from "@/api/company/company";
import LoadingScreen from "@/components/LoadingScreen";
import { QUERY_KEYS } from "@/constants/queryKeys";
import CompanyImg from "@/features/settings/company-info/CompanyImg";
import CompanyInfoForm from "@/features/settings/company-info/CompanyInfoForm";
import { useContext } from "react";
import { AbilityContext } from "@/lib/AbilityContext";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";

const CompanyInfo = () => {
  const { data: companyAvatar, isLoading: isLoadingCompanyAvatar } = useQuery({
    queryKey: [QUERY_KEYS.companyAvatar],
    queryFn: () => getCompanyAvatar(),
  });
  const { data: companyData, isLoading: isLoadingCompanyData } = useQuery({
    queryKey: [QUERY_KEYS.companyInfo],
    queryFn: () => getCompany(),
  });

  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "company")) {
    return <RestrictedAccessScreen />;
  }
  if (isLoadingCompanyAvatar || isLoadingCompanyData) return <LoadingScreen />;

  return (
    <div className="pt-6">
      <CompanyImg companyAvatarSrc={companyAvatar as string} />

      <CompanyInfoForm companyData={companyData} />
    </div>
  );
};

export default CompanyInfo;
