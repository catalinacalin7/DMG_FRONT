"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { type LucideProps } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/utils/cn";

export type PageNavType = {
  title: string;
  icon?: React.ComponentType<LucideProps>;
  href: string;
};

function PageNav({
  navItems,
  mainRoute,
}: {
  navItems: PageNavType[];
  mainRoute: string;
}) {
  const [selectedItem, setSelectedItem] = useState<string | null>();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Navigation");

  const basePath = mainRoute ? `/${mainRoute}/` : "/";
  const selectedPath =
    pathname.replace(basePath, "").split("/")[0] || undefined;

  const isActive = (href: string) =>
    href === "" ? selectedPath === undefined : selectedPath === href;

  useEffect(() => {
    const defaultItem = navItems.find(
      (item) => item.href === selectedPath,
    )?.title;
    setSelectedItem(defaultItem);
  }, [selectedPath, navItems]);

  return (
    <div className="">
      <div className="hidden flex-row gap-6 border-b border-gray-200 lg:flex">
        {navItems
          .filter((page) => page.href !== "#")
          .map((page) => {
            return (
              <Link
                key={page.title}
                href={`/${mainRoute}/${page.href}`}
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
      <div className="w-full pb-2 pr-4 text-right lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="border-b-2 border-blue-500 pb-2">
              {selectedItem ? t(selectedItem) : ""}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {navItems
              .filter((page) => page.href !== "#")
              .map((page) => {
                return (
                  <DropdownMenuItem key={page.title} asChild>
                    <Link
                      onClick={() => setSelectedItem(page.title)}
                      href={`/${mainRoute}/${page.href}`}
                      className={`block w-full px-2 py-1 text-sm ${
                        pathname ===
                        (locale === "en" ? page.href : `${page.href}`)
                          ? "font-bold text-blue-600"
                          : ""
                      }`}
                    >
                      {t(page.title)}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
export default PageNav;
