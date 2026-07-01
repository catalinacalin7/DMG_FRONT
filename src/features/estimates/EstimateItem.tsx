"use client";

import { getUserData } from "@/api/auth/get-user-data";
import { getCompany } from "@/api/company/company";
import { getHailEstimateById } from "@/api/estimates/estimates";
import LoadingScreen from "@/components/LoadingScreen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { toDecimal } from "@/utils/numberUtils";
import { useQuery } from "@tanstack/react-query";
import { Euro } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { PanelSatus } from "@/api/estimates/estimates";

function EstimateItem() {
  const tAuth = useTranslations("Auth");
  const t = useTranslations("PageEstimates");
  const tPanelStatus = useTranslations("CarPanelStatus");
  const { id } = useParams();

  const { data: userData } = useQuery({
    queryKey: [QUERY_KEYS.userData],
    queryFn: getUserData,
  });

  const { data: companyData } = useQuery({
    queryKey: [QUERY_KEYS.companyInfo],
    queryFn: () => getCompany(),
  });

  const { data: estimateHail, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.getHailEstimate],
    queryFn: () => getHailEstimateById(id as string),
    enabled: !!id,
  });

  const estimatedPanels = estimateHail?.estimateHailPanel.filter(
    (panel) => panel.panelStatus !== "noDamage",
  );

  const totalHailPrice = !!estimateHail?.total
    ? toDecimal(estimateHail.total)
    : 0;

  const createdAt = new Date(
    estimateHail?.createdAt as Date,
  ).toLocaleDateString();

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex flex-col gap-16">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2 rounded-3xl bg-blue-300 px-6 py-4 text-white md:col-span-3">
          <div className="flex-start flex">
            <Avatar className="h-16 w-16 self-center rounded-full">
              <AvatarImage
                src={`https://dmg-api.vecdev.md/users/superadmin/get/avatar/${userData?.id || ""}?key=${Date.now()}`} // `key` is used to prevent image caching
                loading="lazy"
              />

              <AvatarFallback className="bg-muted rounded-full text-xl font-medium text-blue-600">
                {userData?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="py-2 text-xl font-semibold">{companyData?.name}</h3>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">{tAuth("adress")}: </p>
            <p className="text-sm"> {companyData?.address}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">{tAuth("email")}: </p>
            <p className="text-sm"> {companyData?.email}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">{tAuth("phone")}: </p>
            <p className="text-sm"> {companyData?.phone}</p>
          </div>
        </div>
        <div className="bg-offwhite-300 flex flex-col gap-4 rounded-3xl px-6 py-6 md:col-span-2">
          <div className="flex flex-col gap-2 rounded-3xl bg-white p-6">
            <h4 className="py-2 text-lg font-semibold">
              {t("estimateNumber")}: #001
            </h4>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">{t("dateCreatedAt")}: </p>
              <p className="text-sm"> {createdAt}</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">{t("estimateBy")}: </p>
              <p className="text-sm"> {estimateHail?.user?.name!}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 px-2">
            <p className="py-2 text-lg font-semibold text-gray-500">
              {t("estimateTo")}:{" "}
            </p>
            <div className="flex flex-col gap-2">
              <h4 className="text-2xl font-bold">
                {estimateHail?.client?.name}
              </h4>
              <div className="text-base text-gray-500">
                {" "}
                {estimateHail?.client?.address}
              </div>
              <div className="text-base text-gray-500">
                {" "}
                {estimateHail?.client?.country}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="py-8 text-xl uppercase">{t("estimateDetails")}</h4>
        <div className="py-2">
          <div className="flex w-full flex-col items-center justify-between rounded-xl border p-4 lg:flex-row">
            <div className="grid w-full grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-6">
              <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                <div className="flex items-center">
                  <small className="pb-1">{t("vehicle")}</small>
                </div>
                <div className="flex items-center text-base font-medium text-black">
                  <h3>
                    {estimateHail?.vehicle?.year} {estimateHail?.vehicle?.make}{" "}
                    {estimateHail?.vehicle?.model}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                <small className="pb-1">{t("vin")}</small>
                <div className="flex items-center text-base font-medium text-black">
                  {estimateHail?.vehicle?.vinNumber}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-6">
          <div className="flex flex-col gap-2">
            {estimatedPanels?.map((panel) => {
              return (
                <div
                  key={panel.id}
                  className="bg-offwhite-300 grid w-full grid-cols-1 items-center gap-4 rounded-xl border p-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-4"
                >
                  <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                    <div className="flex items-center">
                      <small className="pb-1">{t("panel")}</small>
                    </div>
                    <div className="flex items-center text-base font-medium text-black">
                      <h3>{t(panel.panel)}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                    <div className="flex items-center">
                      <small className="pb-1">{t("description")}</small>
                    </div>
                    <div className="flex items-center text-base font-medium text-black">
                      {panel.panelStatus === PanelSatus.pdr ? (
                        <h3>
                          {t("lightDents")}: {panel.light}, {t("mediumDents")}:{" "}
                          {panel.medium},{t("strongDents")}: {panel.strong}
                        </h3>
                      ) : (
                        <h3>{tPanelStatus(panel.panelStatus)}</h3>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                    <div className="flex items-center">
                      <small className="pb-1">{t("rate")}</small>
                    </div>
                    <div className="flex items-center text-base font-medium text-black">
                      <h3>
                        {panel.panelStatus === PanelSatus.pdr
                          ? estimateHail?.rate
                          : 0}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                    <div className="flex items-center">
                      <small className="pb-1">{t("total")}</small>
                    </div>
                    <div className="flex items-center text-base font-medium text-black">
                      <h3>{toDecimal(panel.panelTotal)}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex justify-between px-6 text-blue-600">
            <div className="">
              <h4 className="text-xl">{t("total")}: </h4>
            </div>
            <div className="flex items-center justify-center text-2xl">
              <Euro size={22} /> {totalHailPrice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EstimateItem;
