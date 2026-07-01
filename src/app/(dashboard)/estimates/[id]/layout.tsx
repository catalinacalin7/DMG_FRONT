import EditEstimateNav from "@/features/estimates/EditEstimateNav";
import { useTranslations } from "next-intl";

const EstimateEditLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const t = useTranslations("Navigation");
  return (
    <div>
      <h3 className="hidden pb-6 text-3xl font-bold lg:block">
        {t("estimates")}
      </h3>
      <EditEstimateNav />

      <div>{children}</div>
    </div>
  );
};

export default EstimateEditLayout;
