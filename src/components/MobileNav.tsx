"use client";
import { useState } from "react";
import {
  Compass,
  UserRound,
  LucideIcon,
  Mail,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";

import { IconType } from "react-icons/lib";
import { TbLayoutGridFilled } from "react-icons/tb";

import { cn } from "@/utils/cn";

import AppSettings from "./AppSettings";
import { Sheet } from "./ui/sheet";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

type NavigationTab =
  | {
      title: string;
      icon: LucideIcon | IconType;
      href: string;
      type: "link";
    }
  | {
      icon: LucideIcon | IconType;
      type: "settings";
      title: string;
    }
  | {
      icon: LucideIcon | IconType;
      href: "/home";
      type: "main";
    };

const navigationTabs: NavigationTab[] = [
  {
    title: "estimate",
    icon: UserRound,
    href: "/estimates/hail/estimate-france",
    type: "link",
  },
  {
    title: "invoice",
    icon: Compass,
    href: "/invoices/create",
    type: "link",
  },
  {
    icon: TbLayoutGridFilled,
    href: "/home",
    type: "main",
  },
  {
    title: "clients",
    icon: Users,
    href: "/clients",
    type: "link",
  },
  {
    title: "settings",
    icon: SettingsIcon,
    type: "settings",
  },
];

const MobileNav = () => {
  const pathname = usePathname();

  const t = useTranslations("Navigation");

  const [isOpenSettings, setIsOpenSettings] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 flex w-full items-center justify-between bg-white px-6 py-3">
      {navigationTabs.map((item, index) => {
        switch (item.type) {
          case "settings":
            return (
              <Sheet key={item.title} open={isOpenSettings}>
                <div
                  className="flex flex-col items-center justify-center gap-[2px] text-gray-500"
                  onClick={() => setIsOpenSettings(true)}
                >
                  <item.icon size={20} />

                  <p className="text-[10px] font-semibold">{t(item.title)}</p>
                </div>

                <AppSettings setIsOpenSettings={setIsOpenSettings} />
              </Sheet>
            );

          case "link":
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-[2px] text-gray-500",
                  item.href === pathname && "text-brand-dark",
                )}
              >
                <item.icon size={20} />

                <p className="text-[10px] font-semibold">{t(item.title)}</p>
              </Link>
            );

          case "main":
            return (
              <div className="ml-[9px]" key={item.href}>
                <Link
                  href={item.href}
                  className="bg-brand-dark flex items-center justify-center rounded-full p-2"
                >
                  <item.icon size={30} color="#fff" />
                </Link>
              </div>
            );
        }
      })}
    </nav>
  );
};

export default MobileNav;
