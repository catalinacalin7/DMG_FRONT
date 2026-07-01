"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

import React from "react";

import { postAuthLogout } from "@/api/auth/logout";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { QUERY_KEYS } from "@/constants/queryKeys";

import { SIDEBAR_DESKTOP_NAVIGATION } from "../constants/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

const SidebarDesktop = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const t = useTranslations("Navigation");

  const logoutMutation = useMutation({
    mutationFn: postAuthLogout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.userData],
      });

      router.push(`/sign-in`);
    },
  });

  return (
    <Sidebar className="border-none">
      <SidebarHeader className="px-5 pt-5">
        <div
          className="flex cursor-pointer items-center justify-center"
          onClick={() => router.push(`/home`)}
        >
          <Image src={"/emaster.svg"} width={202} height={202} alt="logo" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {SIDEBAR_DESKTOP_NAVIGATION.map((item) => {
            const isActivePath = pathname === item.url;
            return (
              <SidebarMenuButton
                key={item.title}
                isActive={isActivePath}
                asChild
                className={cn(
                  "text-brand-dark hover:bg-[#f5f5f5] [&>span]:text-[#5F6165]",
                  {
                    "bg-brand-dark text-white hover:bg-brand-light [&>span]:text-white":
                      isActivePath,
                  },
                )}
              >
                <Link href={item.url}>
                  <item.icon className="h-6! w-6!" />

                  <span className="text-base">{t(item.title)}</span>
                </Link>
              </SidebarMenuButton>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton
            className={cn("hover:bg-[#f5f5f5]")}
            onClick={() => router.push(`/settings/company-info`)}
          >
            <Settings className="h-6! w-6! text-brand-dark" />

            <span className="text-base text-[#5F6165]">{t("settings")}</span>
          </SidebarMenuButton>

          <SidebarMenuButton onClick={() => logoutMutation.mutate()}>
            <LogOut className="h-6! w-6! rotate-180 text-brand-dark" />

            <span className="text-base text-[#5F6165]">{t("logOut")}</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarDesktop;
