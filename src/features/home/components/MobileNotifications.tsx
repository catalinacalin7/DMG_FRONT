"use client";
import { Search, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Notification from "@/components/notification/Notification";
import { Input } from "@/components/ui/input";

import { useDebounce } from "use-debounce";
import { useDataNotificationsList } from "@/hooks/useDataNotificationsList";

import { EstimatesStatusType, TabsType } from "@/types/estimates";
import { useRouter } from "@/i18n/navigation";
const TABS_VALUES: TabsType[] = ["unread", "all"];

const MobileNotifications = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
    <>
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder={t("searchSomething")}
            endIcon={<Search className="text-gray-300" />}
            className="h-10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div
            className="rounded-xl border p-2"
            onClick={() => setIsFiltersOpen(true)}
          >
            <Settings2 />
          </div>
        </div>
        <div className="flex w-full items-center justify-end">
          <Tabs defaultValue={activeTab} className="w-full">
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

        <div className="flex flex-col gap-3">
          {estimates?.map((item, index) => {
            return (
              <Notification
                key={item.id}
                vehicleMake={item?.vehicle?.make}
                clientName={item?.client?.name!}
                identifier={index + 1}
                model={item?.vehicle?.model!}
                vin={item.vehicle?.vinNumber!}
                price={item?.total}
                year={item?.vehicle?.year.toString()!}
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
      </section>
    </>
  );
};

export default MobileNotifications;
