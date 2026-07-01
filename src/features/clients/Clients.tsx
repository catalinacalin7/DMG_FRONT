"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import ClientsList from "./ClientsList";
import { useTranslations } from "next-intl";
import { useDebounce } from "use-debounce";
import { Link } from "@/i18n/navigation";

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

type clientType = "BUSINESS" | "PRIVATE";

const Clients = () => {
  const searchParams = useSearchParams();

  const t = useTranslations("PageClients");
  const tButton = useTranslations("ui");
  const [activeTab, setActiveTab] = useState<clientType>("BUSINESS");

  useEffect(() => {
    const tabSearchParam = searchParams.get("tab") as clientType;

    if (!tabSearchParam) return;

    setActiveTab(tabSearchParam);
  }, [searchParams]);

  return (
    <div className="">
      <Tabs value={activeTab} className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4">
          <TabsList className="flex h-[45px] grow rounded-lg p-2 px-4 md:w-[300px] md:flex-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                onClick={() => setActiveTab(tab.value as clientType)}
                className="w-full py-1"
              >
                {t(tab.title.toLowerCase())}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button size="lg" className=" ">
            <Link href={`/clients/add-client`}>
              {tButton("buttons.addClient")}
            </Link>
          </Button>
        </div>

        <ClientsList clientType={activeTab} />
      </Tabs>
    </div>
  );
};

export default Clients;
