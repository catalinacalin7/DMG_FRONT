"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import MobileNav from "@/components/MobileNav";

import HeaderMobile from "./components/HeaderMobile";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const route = pathname.replace(/^\/(en|ru|fr|de)(\/|$)/, "/").split("/")[1];
    setPageTitle(t(route));
  }, [pathname, t]);
  const isHomePage = pathname === "/home";
  return (
    <div className="relative xl:hidden">
      <HeaderMobile pageTitle={pageTitle} />
      <div
        className={cn({
          "px-2 pb-32 pt-2": !isHomePage,
        })}
        style={{
          position: isHomePage ? "absolute" : "inherit",
          top: isHomePage ? "75px" : "inherit",
          left: isHomePage ? "50%" : "inherit",
          transform: isHomePage ? "translate(-50%)" : "inherit",
          width: "100%",
        }}
      >
        {children}
      </div>
      <MobileNav />
    </div>
  );
};

export default MobileLayout;
