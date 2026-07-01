"use client";

import { useEffect, useState } from "react";
import { Search, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useDataNotificationsList } from "@/hooks/useDataNotificationsList";
import { useDebounce } from "use-debounce";

import Notification from "@/components/notification/Notification";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { EstimatesStatusType, TabsType } from "@/types/estimates";
import { useRouter } from "@/i18n/navigation";

const TABS_VALUES: TabsType[] = ["unread", "all"];
const NotificationsDesktop = () => {
  const router = useRouter();
  const t = useTranslations("PageHome");
  const [activeTab, setActiveTab] = useState<TabsType>("unread");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDebounced] = useDebounce(searchQuery, 1000);

  const {
    data: estimates,
    refetch: refetchEstimates,
    estimateStatusMutation,
  } = useDataNotificationsList(searchQueryDebounced, activeTab);

  useEffect(() => {
    refetchEstimates();
  }, [refetchEstimates, activeTab, searchQueryDebounced]);

  return (
    <div className="bg-background flex flex-col gap-6 rounded-xl border border-solid border-[#E6EDFF] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">{t("notifications")}</h2>

        <Tabs defaultValue={activeTab} className="w-[225px]">
          <TabsList className="grid w-full grid-cols-2 gap-2">
            {TABS_VALUES.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                onClick={() => setActiveTab(tab as TabsType)}
                className="w-full py-1"
              >
                {t(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder={t("searchSomething")}
          endIcon={<Search className="text-gray-300" />}
          className="h-[50px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="cursor-pointer rounded-xl border p-3 text-gray-300">
          <Settings2 />
        </div>
      </div>

      <ScrollArea className="h-full max-h-[854px]">
        <div className="flex flex-col gap-3">
          {estimates?.map((item, index) => {
            return (
              <Notification
                key={item.id}
                vehicleMake={item?.vehicle?.make}
                clientName={item?.client?.name}
                identifier={index + 1}
                model={item?.vehicle?.model}
                vin={item?.vehicle?.vinNumber}
                price={item?.total}
                year={item?.vehicle?.year?.toString()}
                onApprove={() =>
                  estimateStatusMutation.mutate({
                    data: { status: EstimatesStatusType.approved },
                    id: item.id as string,
                  })
                }
                onEdit={() => {
                  router.push(`/estimates/${item.id}/edit`);
                }}
                isApproved={item.status === EstimatesStatusType.approved}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationsDesktop;
