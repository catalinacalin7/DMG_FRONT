"use client";
import React from "react";

import { CLIENT_NAVIGATION } from "@/constants/client-navigation";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";

const PageNavMenu = () => {
  const t = useTranslations("PageClients");
  const pathname = usePathname();
  const { id: clientId } = useParams();

  const selectedPath = pathname.split("/")[3] || "";

  const isActive = (href: string) =>
    href === "" ? selectedPath === "" : selectedPath === href;

  return (
    <div className="border-b border-gray-200">
      <div className="flex justify-center gap-4 overflow-hidden md:justify-start md:gap-6">
        {CLIENT_NAVIGATION.map((page) => {
          return (
            <Link
              key={page.title}
              href={`/clients/${clientId}/${page.href}`}
              className={cn(
                "hover:text-brand-light text-nowrap",
                isActive(page.href)
                  ? "border-brand-dark text-brand-dark hover:border-brand-light border-b-[3px] pb-4 font-bold"
                  : "",
              )}
            >
              {t(page.title)}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PageNavMenu;
