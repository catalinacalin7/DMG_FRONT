"use client";
import { Euro } from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getInvoice } from "@/api/invoices/invoices";
import { useParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { getCompany } from "@/api/company/company";
import { QUERY_KEYS } from "@/constants/queryKeys";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserData } from "@/api/auth/get-user-data";
import { toDecimal } from "@/utils/numberUtils";
import { useTranslations } from "next-intl";

const InvoiceItem = () => {
  const t = useTranslations("PageInvoices");
  const tId = useTranslations("Auth");
  const tEstimate = useTranslations("PageEstimates");
  const { id } = useParams();

  const { data: userData } = useQuery({
    queryKey: [QUERY_KEYS.userData],
    queryFn: getUserData,
  });

  const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ["invoice"],
    queryFn: async () => await getInvoice(id as string),
    enabled: !!id,
  });

  const { data: company, isLoading: isLoadingCompnay } = useQuery({
    queryKey: [QUERY_KEYS.companyInfo],
    queryFn: async () => await getCompany(),
  });

  if (isLoadingInvoice || isLoadingCompnay) {
    return <LoadingScreen />;
  }
  return (
    <div className="flex flex-col gap-16">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2 rounded-3xl bg-blue-600 px-6 py-4 text-white md:col-span-3">
          <div className="flex-start flex">
            <Avatar className="h-16 w-16 self-center rounded-full">
              <AvatarImage
                src={`https://dmg-api.vecdev.md/users/superadmin/get/avatar/${userData?.id || ""}?key=${Date.now()}`} // `key` is used to prevent image caching
                loading="lazy"
              />

              <AvatarFallback className="rounded-full bg-gray-200 text-xl font-medium text-blue-600">
                {userData?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="py-2 text-xl font-semibold">{company?.name}</h3>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">{tId("adress")}: </p>
            <p className="text-sm">{company?.address}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">{tId("email")}: </p>
            <p className="text-sm">{company?.email}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">{tId("phone")}: </p>
            <p className="text-sm">{company?.phone}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl bg-gray-200 px-6 py-6 md:col-span-2">
          <div className="flex flex-col gap-2 rounded-3xl bg-white p-6 shadow-md">
            <h4 className="py-2 text-lg font-semibold">{t("amountDue")}</h4>
            <div className="flex items-center gap-1">
              <p className="flex items-center gap-1 text-xl font-bold">
                <Euro size={22} />{" "}
                {invoice && toDecimal(invoice.amountDue - invoice.discount)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-gray-300">
                {invoice && dayjs(invoice.createdAt).format("DD MMMM YYYY")}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 px-2">
            <p className="py-2 text-lg font-semibold text-gray-500">
              {t("invoiceTo")}:
            </p>
            <div className="flex flex-col gap-2">
              <h4 className="text-2xl font-bold">{invoice?.client.name}</h4>
              <div className="text-base text-gray-500">
                {invoice?.client.address}
              </div>
              <div className="text-base text-gray-500">
                {invoice?.client.country}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="py-8 text-xl uppercase">{t("invoiceDetails")}</h4>
        <div className="py-2">
          <div className="flex w-full flex-col items-center justify-between rounded-xl border p-4 lg:flex-row">
            <div className="grid w-full grid-cols-1 items-center gap-4 lg:grid-cols-3 lg:gap-6">
              <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                <div className="flex items-center">
                  <small className="pb-1">{t("invoiceNumber")}</small>
                </div>
                <div className="flex items-center text-base font-medium text-black">
                  <h3>{invoice && `${invoice?.series}-${invoice?.number}`}</h3>
                </div>
              </div>
              <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                <small className="pb-1">{t("issued")}</small>
                <div className="flex items-center text-base font-medium text-black">
                  {invoice && dayjs(invoice.createdAt).format("DD MMMM YYYY")}
                </div>
              </div>
              <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                <small className="pb-1">{t("dueDate")}</small>
                <div className="flex items-center text-base font-medium text-black">
                  {invoice && dayjs(invoice.dueDate).format("DD MMMM YYYY")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-6">
          <div className="flex flex-col gap-2">
            {invoice?.estimateService.map((service) => {
              return (
                <div
                  key={service.estimateHailId}
                  className="bg-offwhite-300 grid w-full grid-cols-1 items-center gap-4 rounded-xl border p-4 md:grid-cols-3 lg:gap-6 xl:grid-cols-3"
                >
                  <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                    <div className="flex items-center">
                      <small className="pb-1">
                        {tEstimate("estimateNumber")}
                      </small>
                    </div>
                    <div className="flex items-center text-base font-medium text-black">
                      <h3>{`${service.serviceName}`}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                    <div className="flex items-center">
                      <small className="pb-1">{tEstimate("vehicle")}</small>
                    </div>
                    <div className="flex items-center text-base font-medium text-black">
                      {`${service.description}`}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between border-b py-1 lg:border-none">
                    <div className="flex items-center">
                      <small className="pb-1">{tEstimate("total")}:</small>
                    </div>
                    <div className="flex items-center text-base font-medium text-black">
                      <h3>{toDecimal(service.price)}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between px-6 pt-2">
            <div>{t("subTotal")}:</div>
            <div className="flex items-center justify-center text-lg">
              <Euro size={18} /> {invoice && toDecimal(invoice?.amountDue)}
            </div>
          </div>
          <div className="flex justify-between px-6 text-gray-300">
            <div className="">
              <h4 className="text-lg">{t("discount")}:</h4>
            </div>
            <div className="flex items-center justify-center text-lg">
              <Euro size={18} /> {invoice && toDecimal(invoice.discount)}
            </div>
          </div>
          <div className="flex justify-between px-6 text-blue-600">
            <div className="">
              <h4 className="text-xl">{tEstimate("total")}: </h4>
            </div>
            <div className="flex items-center justify-center text-2xl">
              <Euro size={22} />{" "}
              {invoice && toDecimal(invoice.amountDue - invoice.discount)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItem;
