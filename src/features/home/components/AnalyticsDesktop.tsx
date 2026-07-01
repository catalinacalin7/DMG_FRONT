"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  periodType,
  useDataInvoicesAnalytics,
} from "@/hooks/useDataInvoicesAnalytics";

const AnalyticsDesktop = () => {
  const t = useTranslations("PageHome");
  const tDate = useTranslations("Date");

  const [period, setPeriod] = useState<periodType>("monthly");

  const { data: chartData, refetch: refetchInvoice } =
    useDataInvoicesAnalytics(period);

  const chartConfig = {
    openInvoices: {
      label: t("openInvoices"),
      color: "#155dfc",
    },
    closedInvoices: {
      label: t("closedInvoices"),
      color: "#ff8904",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    refetchInvoice();
  }, [refetchInvoice]);

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-solid border-[#E6EDFF] bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">{t("analytics")}</h2>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-brand-dark" />

            <span className="text-xs">{t("openInvoices")}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FF9500]" />

            <span className="text-xs">{t("closedInvoices")}</span>
          </div>

          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as periodType)}
          >
            <SelectTrigger className="h-[26px] w-fit border-none shadow-md">
              <SelectValue placeholder={tDate("monthly")} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="weekly">{tDate("weekly")}</SelectItem>

                <SelectItem value="monthly">{tDate("monthly")}</SelectItem>

                {/* <SelectItem value="yearly">{tDate("yearly")}</SelectItem> */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ChartContainer
        key={period}
        config={chartConfig}
        className="h-[250px] w-full"
      >
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}`}
          />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />

          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

          <Line
            dataKey="closedInvoices"
            type="monotone"
            stroke="#FF9500"
            strokeWidth={2}
            dot={false}
          />

          <Line
            dataKey="openInvoices"
            type="monotone"
            stroke="#224b98"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default AnalyticsDesktop;
