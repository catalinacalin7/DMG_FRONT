import { Metadata } from "next";
import SettingsNavMenu from "@/features/settings/navigation/SettingsNavMenu";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Settings",
};

const SettingsPage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const t = useTranslations("Navigation");
  return (
    <div>
      <h3 className="text-3xl font-bold lg:py-4">{t("settings")}</h3>
      <SettingsNavMenu />

      <div>{children}</div>
    </div>
  );
};

export default SettingsPage;
