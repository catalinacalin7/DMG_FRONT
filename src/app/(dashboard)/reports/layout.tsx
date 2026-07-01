"use client";

import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";
import ReportsNavMenu from "@/features/reports/navigation/ReportsNavMenu";
import { AbilityContext } from "@/lib/AbilityContext";
import { useTranslations } from "next-intl";
import { useContext } from "react";

const ReportsLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("Navigation");
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "reports")) {
    return <RestrictedAccessScreen />;
  }
  return (
    <div>
      <h3 className="text-3xl font-bold lg:py-4">{t("reports")}</h3>
      <ReportsNavMenu />

      <div>{children}</div>
    </div>
  );
};

export default ReportsLayout;
