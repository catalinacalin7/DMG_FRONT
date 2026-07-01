"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessForm from "./ClientForms/BusinessForm";
import PrivateForm from "./ClientForms/PrivateForm";
import { useTranslations } from "next-intl";

const tabs = [
  {
    value: "BUSINESS",
    title: "Business",
  },
  {
    value: "PRIVATE",
    title: "Private",
  },
];

const AddClient = () => {
  const t = useTranslations("PageClients");
  const [activeTab, setActiveTab] = useState("BUSINESS");

  return (
    <div className="flex flex-col items-center gap-6">
      <Tabs
        value={activeTab}
        activationMode="manual"
        className="flex w-full flex-col gap-6"
      >
        <TabsList className="flex h-[45px] w-full grow rounded-lg p-2 px-4 md:w-[300px] md:flex-none">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="w-full"
            >
              {t(tab.title.toLowerCase())}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="BUSINESS">
          <BusinessForm />
        </TabsContent>
        <TabsContent value="PRIVATE">
          <PrivateForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddClient;
