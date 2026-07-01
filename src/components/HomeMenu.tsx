"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Calculator,
  CalendarDays,
  ChevronDown,
  FileChartColumn,
  House,
  ReceiptText,
  Share2,
  Users,
} from "lucide-react";
import Image from "next/image";

import React from "react";

import { getUserData } from "@/api/auth/get-user-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const menuNavigationTabs = [
  {
    label: "home",
    icon: House,
    href: "/home",
  },
  {
    label: "scheduling",
    icon: CalendarDays,
    href: "/scheduling",
  },
  {
    label: "clients",
    icon: Users,
    href: "/clients",
  },
  {
    label: "estimates",
    icon: Calculator,
    href: "/estimates",
    collapsible: [
      {
        label: "open",
        href: "/estimates?query=open",
      },
      {
        label: "closed",
        href: "/estimates?query=closed",
      },
      {
        label: "all",
        href: "/estimates?query=all",
      },
    ],
  },
  {
    label: "workflow",
    icon: Share2,
    href: "/workflow",
  },
  {
    label: "invoices",
    icon: ReceiptText,
    href: "/invoices",
  },
  {
    label: "reports",
    icon: FileChartColumn,
    href: "/reports/invoices",
  },
];

const HomeMenu = () => {
  const pathname = usePathname();

  const t = useTranslations("Navigation");

  const { data: userData } = useQuery({
    queryKey: [QUERY_KEYS.userData],
    queryFn: getUserData,
  });

  return (
    <SheetContent side={"left"} className="flex w-full flex-col gap-0 p-0">
      <SheetTitle className="sr-only" />

      <div className="flex items-center gap-3 p-6">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={`https://dmg-api.vecdev.md/users/superadmin/get/avatar/${userData?.id || ""}`} // `key` is used to prevent image caching
            loading="lazy"
          />

          <AvatarFallback>
            {userData?.name ? userData.name.slice(0, 2).toUpperCase() : ""}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="text-[15px] font-semibold">{userData?.name}</p>

          <p className="text-xs text-gray-400">{userData?.email}</p>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2 overflow-y-auto p-6">
        <div className="flex flex-col gap-5">
          {menuNavigationTabs.map((item) =>
            !item.collapsible ? (
              <Link
                href={item.href}
                key={item.label}
                className={cn(
                  "flex items-center justify-between rounded-lg p-2",
                  item.href === pathname && "bg-brand-dark text-white",
                )}
              >
                <SheetClose>
                  <div className="flex items-center gap-4">
                    <item.icon
                      className={cn(
                        "text-brand-dark",
                        item.href === pathname && "text-white",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[15px] font-semibold text-black",
                        item.href === pathname && "text-white",
                      )}
                    >
                      {t(item.label)}
                    </span>
                  </div>
                </SheetClose>
                {item.collapsible && <ChevronDown className="text-gray-300" />}
              </Link>
            ) : (
              <Collapsible key={item.label}>
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg p-3",
                    item.href === pathname && "bg-brand-dark text-white",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon
                      className={cn(
                        "text-brand-dark",
                        item.href === pathname && "text-white",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[15px] font-semibold text-black",
                        item.href === pathname && "text-white",
                      )}
                    >
                      {t(item.label)}
                    </span>
                  </div>

                  {item.collapsible && (
                    <ChevronDown className="text-gray-400" />
                  )}
                </CollapsibleTrigger>

                <CollapsibleContent className="flex flex-col">
                  {item.collapsible.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="p-4 pl-12 text-[15px] font-semibold text-black"
                    >
                      <SheetClose>{t(item.label)}</SheetClose>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ),
          )}
        </div>
      </div>
    </SheetContent>
  );
};

export default HomeMenu;
