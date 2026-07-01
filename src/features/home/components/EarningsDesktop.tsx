"use client";

import { Cell, Pie, PieChart } from "recharts";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Earnings,
  useDataInvoicesEarnings,
} from "@/hooks/useDataInvoicesEarnings";

const EarningsDesktop = () => {
  const t = useTranslations("PageInvoices");
  const tNavigation = useTranslations("Navigation");

  const { data: chartData, refetch: refetchInvoice } =
    useDataInvoicesEarnings();

  const chartConfig = {
    open: {
      label: t("DRAFT"),
      color: "#224b98",
    },
    closed: {
      label: t("ISSUED"),
      color: "#ff8904",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    refetchInvoice();
  }, [refetchInvoice]);

  return (
    <div className="bg-background flex flex-col gap-6 rounded-xl border border-solid border-[#E6EDFF] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">{tNavigation("invoices")}</h2>
      </div>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-full w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            className="bg-brand-dark"
          >
            {chartData?.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={chartConfig[entry.status as Earnings].color}
                />
              );
            })}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="flex items-center justify-center gap-5">
        <div className="flex items-center gap-2">
          <div className="bg-brand-dark h-2 w-2 rounded-full" />

          <span className="text-center text-xs">{t("DRAFT")}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FF9500]" />

          <span className="text-center text-xs">{t("ISSUED")}</span>
        </div>
      </div>
    </div>
  );
};

export default EarningsDesktop;
