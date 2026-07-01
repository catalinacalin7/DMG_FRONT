"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PanelImage from "@/features/estimates/PanelImage";
import VehicleImage from "@/features/estimates/VehicleImage";
import { useTranslations } from "next-intl";
import { useState } from "react";

const tabs = [
  {
    value: "panel",
    component: PanelImage,
    title: "panel",
  },
  {
    value: "vehicle",
    component: VehicleImage,
    title: "vehicle",
  },
];

function MediaPage() {
  const [activeTab, setActiveTab] = useState("panel");
  const t = useTranslations("PageEstimates");
  return (
    <Tabs
      value={activeTab}
      activationMode="manual"
      className="flex min-h-full w-full flex-col gap-6 px-0 pb-16 pt-3"
    >
      <TabsList className="flex h-[45px] grow rounded-lg p-2 px-4 md:w-[300px] md:flex-none">
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
}
export default MediaPage;
