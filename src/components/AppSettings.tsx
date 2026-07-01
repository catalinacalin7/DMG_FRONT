"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileBadge,
  FileText,
  Info,
  Landmark,
  UserRound,
  UserRoundPen,
} from "lucide-react";

import { usePathname } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";

import { postAuthLogout } from "@/api/auth/logout";
import { Button } from "@/components/ui/button";
import { SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { SETTINGS_NAVIGATION } from "@/constants/settings-navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Link, useRouter } from "@/i18n/navigation";

const generalMenuItems = [
  {
    title: "Company Info",
    icon: Building2,
    href: "/user/settings/company-info",
  },
  {
    title: "companyPayment",
    icon: Landmark,
    href: "/settings/company-payment",
  },
  {
    title: "Account Preference",
    icon: UserRound,
    href: "/user/settings/account-preference",
  },
  {
    title: "Users",
    icon: UserRoundPen,
    href: "/user/settings/users",
  },
  {
    title: "Matrix",
    icon: FileText,
    href: "/user/settings/matrix",
  },

  {
    title: "Notifications",
    icon: Bell,
    href: "/user/settings/notifications",
  },
];

type SettingsProps = {
  setIsOpenSettings: Dispatch<SetStateAction<boolean>>;
};

const AppSettings = ({ setIsOpenSettings }: SettingsProps) => {
  const tLanguage = useTranslations("Language");
  const router = useRouter();
  const queryClient = useQueryClient();

  const t = useTranslations("Navigation");
  const locale = useLocale();

  const logoutMutation = useMutation({
    mutationFn: postAuthLogout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.userData],
      });

      router.push(`/sign-in`);
    },
  });
  const changeLanguage = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
    router.refresh();
  };

  return (
    <SheetContent
      hideClose
      side={"right"}
      className="flex h-full w-full flex-col p-0"
    >
      <SheetTitle className="sr-only" />

      <div className="bg-brand-dark flex items-center justify-between p-4">
        <span
          className="rounded-full border border-solid border-white p-1"
          onClick={() => setIsOpenSettings(false)}
        >
          <ChevronLeft className="text-white" />
        </span>

        <h2 className="font-semibold text-white">{t("menu")}</h2>

        <div className="w-[42px]" />
      </div>

      <div className="flex h-full flex-col justify-between gap-10 overflow-y-auto p-6">
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-medium text-gray-300">{t("general")}</h3>

          <div className="flex flex-col gap-5">
            {SETTINGS_NAVIGATION.map((item) =>
              !item.collapsible ? (
                <Link
                  href={`/settings/${item.href}`}
                  key={item.title}
                  className="flex items-center justify-between"
                  onClick={() => setIsOpenSettings(false)}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-[10px]">
                      <item.icon size={20} className="text-brand-dark" />
                    </div>

                    <span>{t(item.title)}</span>
                  </div>

                  <ChevronRight className="text-gray-300" />
                </Link>
              ) : (
                <Collapsible key={item.title}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 p-[10px]">
                        <item.icon size={20} className="text-brand-dark" />
                      </div>
                      <span>{t(item.title)}</span>
                    </div>

                    <div className="ml-auto">
                      <ChevronRight className="block text-gray-300" />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="flex flex-col">
                    {item.collapsible
                      .filter((subItem) => subItem.lang !== locale)
                      .map((subItem) => (
                        <SheetClose key={subItem.lang}>
                          <p
                            onClick={() => changeLanguage(subItem.lang)}
                            className="w-full p-4 pl-12 text-left text-[15px]"
                          >
                            {tLanguage(subItem.label)}
                          </p>
                        </SheetClose>
                      ))}
                  </CollapsibleContent>
                </Collapsible>
              ),
            )}
          </div>
        </div>

        <div>
          <Button
            variant={"outline"}
            className="w-full border-red-500 font-semibold text-red-500"
            onClick={() => logoutMutation.mutate()}
          >
            {t("logOut")}
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};

export default AppSettings;
