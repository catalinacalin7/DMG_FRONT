"use client";
import { ArrowDownLeft, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { useDataStatsCardsData } from "@/hooks/useDataStatsCardsData";
import { useEffect } from "react";
import { useDataNotificationsList } from "@/hooks/useDataNotificationsList";

const StatsDesktop = () => {
  const t = useTranslations("PageHome");
  const { data: mockData, refetch } = useDataStatsCardsData();
  const { refetch: refetchEstimates } = useDataNotificationsList("");

  useEffect(() => {
    refetch();
  }, [refetch, refetchEstimates]);
  return (
    <div className="grid grid-cols-4 items-center gap-4 rounded-xl border border-[#E6EDFF] bg-white p-5">
      {mockData.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col gap-3 border-r border-solid border-[#E6EDFF] px-8",
            index === mockData.length - 1 && "border-none pr-0",
            index === 0 && "pl-0",
          )}
        >
          <div className="flex w-full items-start justify-between">
            <div>
              <h2 className="text-3xl font-semibold">{item.value}</h2>

              <p>{t(item.name)}</p>
            </div>

            <div className="rounded-lg p-3 shadow-md">
              <item.icon className="h-6 w-6 text-brand-dark" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                item.trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {item.trend === "neutral" ? (
                <Minus />
              ) : item.trend === "up" ? (
                <ArrowUpRight className="text-green" />
              ) : (
                <ArrowDownLeft className="text-red-500" />
              )}

              <span className="text-[#7C8DB5]">{item.change} </span>
            </div>

            <span className="text-sm text-[#7C8DB5]">
              {item.percentage} {t("thisWeek")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsDesktop;
