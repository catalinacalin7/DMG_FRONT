import Image from "next/image";
import React from "react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { toDecimal } from "@/utils/numberUtils";
import { CarLogo } from "@/features/client/garage/CarLogo";

interface NotificationProps {
  identifier: number;
  price: number;
  model: string;
  vin: string;
  year: string;
  clientName: string;
  garageName?: string;
  vehicleMake: string;
  stockRo?: string;
  unassigned?: boolean;
  onEdit?: () => void;
  onApprove?: () => void;
  isApproved?: boolean;
  techName?: string;
  adminName?: string;
}

const Notification = ({
  clientName,
  garageName,
  identifier,
  model,
  vin,
  price,
  year,
  vehicleMake,
  stockRo,
  unassigned,
  onEdit,
  onApprove,
  isApproved,
  techName,
  adminName,
}: NotificationProps) => {
  const t = useTranslations("PageHome");

  const tUI = useTranslations("ui");
  return (
    <div className="border-offwhite-300 flex flex-col gap-2 rounded-2xl border border-solid p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div className="text-sm font-medium text-black">
            {t("estimates")} #{identifier}
          </div>

          {unassigned && (
            <Badge className="rounded-2xl border-0 bg-red-200 px-2 py-1 text-xs font-medium text-red-500">
              <li className="list-inside">{t("unassigned")}</li>
            </Badge>
          )}
        </div>

        <span className="text-brand-dark text-sm font-medium">
          €{toDecimal(price)}
        </span>
      </div>

      <hr className="bg-offwhite-100 h-px border-0" />

      <div className="flex items-center gap-4">
        <div className="bg-offwhite-50 flex h-24 w-24 items-center justify-center p-5">
          {vehicleMake && <CarLogo make={vehicleMake} />}
        </div>

        <div>
          <div className="flex items-center">
            <div className="h-5 w-[60px] text-xs font-medium text-gray-300">
              {t("model")}
            </div>

            <div className="text-xs font-medium text-black">{model}</div>
          </div>
          <div className="flex items-center">
            <div className="h-5 w-[60px] text-xs font-medium text-gray-300">
              VIN
            </div>

            <div className="text-xs font-medium text-black">{vin}</div>
          </div>

          <div className="flex items-center">
            <div className="h-5 w-[60px] text-xs font-medium text-gray-300">
              {t("year")}
            </div>

            <div className="text-xs font-medium text-black">{year}</div>
          </div>
        </div>
      </div>

      <hr className="h-px border-0 bg-gray-100" />

      <div>
        <div className="flex items-center justify-between">
          <div className="h-5 w-[140px] text-xs font-medium text-gray-300">
            {t("clientName")}
          </div>

          <div className="h-5 w-[140px] text-xs font-medium text-gray-300">
            {clientName}
          </div>
        </div>

        {techName && (
          <div className="flex items-center justify-between">
            <div className="h-5 w-[140px] text-xs font-medium text-gray-300">
              {t("techName")}
            </div>

            <div className="h-5 w-[140px] text-xs font-medium text-gray-300">
              {techName}
            </div>
          </div>
        )}
        {adminName && (
          <div className="flex items-center justify-between">
            <div className="h-5 w-[140px] text-xs font-medium text-gray-300">
              {t("adminName")}
            </div>

            <div className="h-5 w-[140px] text-xs font-medium text-gray-300">
              {adminName}
            </div>
          </div>
        )}

        {stockRo && (
          <div className="flex items-center justify-between">
            <div className="h-5 w-[140px] text-xs font-medium text-gray-300">
              {t("garageName")}
            </div>

            <div className="h-5 w-[140px] text-xs font-medium text-gray-300">
              {stockRo}
            </div>
          </div>
        )}
      </div>

      {onEdit && onApprove && (
        <div className="mt-2 flex items-center gap-3">
          <div className="w-full">
            <Button
              variant={"outline"}
              className="h-10 w-full rounded-sm sm:text-sm"
              onClick={onEdit}
            >
              {t("edit")}
            </Button>
          </div>
          <div className="w-full">
            <Button
              className="h-10 w-full rounded-sm sm:text-sm"
              onClick={isApproved ? () => void 0 : onApprove}
            >
              {isApproved ? tUI("buttons.sendEmail") : t("approve")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
