"use client";

import { SETTINGS_NAVIGATION } from "@/constants/settings-navigation";
import PageNav from "@/components/page-nav/PageNav";

function SettingsNavMenu() {
  return <PageNav navItems={SETTINGS_NAVIGATION} mainRoute="settings" />;
}
export default SettingsNavMenu;
