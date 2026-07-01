"use client";

import { EDIT_ESTIMATE_NAV } from "./constants/constants";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/utils/cn";
import { Link, usePathname } from "@/i18n/navigation";

function EditEstimateNav() {
  const t = useTranslations("PageEstimates");
  const { id: estimateId } = useParams();
  const pathname = usePathname();

  const selectedPath = pathname?.split("/")[3] || "";

  const navItems = EDIT_ESTIMATE_NAV;

  const isActive = (href: string) =>
    href === "" ? selectedPath === undefined : selectedPath === href;

  return (
    <div className="border-b border-gray-200">
      <div className="flex justify-center gap-4 overflow-hidden md:justify-start md:gap-6">
        {navItems.map((page) => {
          return (
            <Link
              key={page.href}
              href={`/estimates/${estimateId}/${page.href}`}
              className={cn(
                "text-nowrap hover:text-brand-light",

                isActive(page.href)
                  ? "border-b-[3px] border-brand-dark pb-4 font-bold text-brand-dark hover:border-brand-light"
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
}
export default EditEstimateNav;
