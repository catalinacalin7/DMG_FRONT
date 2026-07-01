"use client";

import React, { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CarInfoTab from "./CarInfoTab";
import HistoryTab from "./HistoryTab";
import { useTranslations } from "next-intl";

const tabs = [
  {
    value: "car-info",
    component: CarInfoTab,
    title: "carInfo",
  },
  {
    value: "history",
    component: HistoryTab,
    title: "history",
  },
];

const VehicleInfoLayout = () => {
  const t = useTranslations("Garage");
  const [activeTab, setActiveTab] = useState("car-info");

  return (
    <Tabs
      value={activeTab}
      activationMode="manual"
      className="flex min-h-full w-full flex-col gap-6 px-0 pb-16 pt-3"
    >
      <TabsList className="flex h-[45px] w-full grow rounded-lg p-2 px-4 md:w-[300px] md:flex-none">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.title}
            value={tab.value}
            className="w-full py-1"
            onClick={() => setActiveTab(tab.value)}
          >
            {t(tab.title)}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => {
        if (activeTab !== tab.value) return null;

        return <tab.component key={tab.title} />;
      })}
    </Tabs>
  );
};

export default VehicleInfoLayout;
