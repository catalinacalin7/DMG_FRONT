import PageNavMenu from "@/components/PageNavMenu";
import { useTranslations } from "next-intl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client",
};

const ClientLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const t = useTranslations("Navigation");
  return (
    <div>
      <h3 className="hidden pb-6 text-3xl font-bold lg:block">
        {t("clients")}
      </h3>
      <PageNavMenu />

      <div className="pt-4"> {children}</div>
    </div>
  );
};

export default ClientLayout;
