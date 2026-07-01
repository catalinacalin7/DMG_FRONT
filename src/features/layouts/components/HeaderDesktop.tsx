"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell, Search } from "lucide-react";
import React from "react";

import { getUserData } from "@/api/auth/get-user-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { QUERY_KEYS } from "@/constants/queryKeys";
import LanguageSwitcher from "@/components/switches/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { getCompanyAvatar } from "@/api/company/company";

const HeaderDesktop = () => {
  const t = useTranslations("PageHome");

  const { data: companyAvatar, isLoading: isLoadingCompanyAvatar } = useQuery({
    queryKey: [QUERY_KEYS.companyAvatar],
    queryFn: () => getCompanyAvatar(),
  });

  const { data: userData } = useQuery({
    queryKey: [QUERY_KEYS.userData],
    queryFn: getUserData,
  });

  return (
    <header className="flex justify-between py-4 pr-8">
      <Input
        startIcon={<Search className="h-5 w-5 text-[#7C7C8D]" />}
        placeholder={t("searchOrType")}
        className="h-[46px] max-w-[360px] rounded-lg border-none bg-[#f5f5f5] focus-visible:shadow-none focus-visible:ring-0"
      />

      <div className="flex items-center gap-6">
        {/* <div className="relative cursor-pointer">
          <div className="bg-brand-dark absolute right-0 top-0 h-[10px] w-[10px] rounded-full" />

          <Bell />
        </div> */}
        <LanguageSwitcher />

        <Avatar className="h-auto w-16 self-center rounded-full border">
          <AvatarImage
            src={companyAvatar}
            loading="lazy"
            className="object-cover"
          />

          <AvatarFallback className="text-brand-dark rounded-full bg-gray-100 object-cover text-xl font-medium">
            {userData?.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default HeaderDesktop;
