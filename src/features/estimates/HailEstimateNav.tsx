"use client";

import PageNav from "@/components/page-nav/PageNav";
import {
  HAIL_ESTIMATE_NAVIGATION,
  HAIL_ESTIMATE_MANUAL_NAVIGATION,
} from "./constants/constants";
import { usePathname } from "next/navigation";

const ESTIMATE_NAV_LINKS = {
  "/estimates/hail/estimate-france": HAIL_ESTIMATE_MANUAL_NAVIGATION,
  "/estimates/hail/estimate": HAIL_ESTIMATE_NAVIGATION,
};

function HailEstimateNav() {
  const pathname = usePathname();
  const navItems = ESTIMATE_NAV_LINKS[pathname];
  if (!navItems) return null;
  return <PageNav navItems={navItems} mainRoute="estimates/hail" />;
}
export default HailEstimateNav;
