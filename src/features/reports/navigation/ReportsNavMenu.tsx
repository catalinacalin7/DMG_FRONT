"use client";
import { REPORTS_NAVIGATION } from "@/constants/reports-navigation";
import PageNav from "@/components/page-nav/PageNav";

function ReportsNavMenu() {
  return <PageNav navItems={REPORTS_NAVIGATION} mainRoute="reports" />;
}
export default ReportsNavMenu;
