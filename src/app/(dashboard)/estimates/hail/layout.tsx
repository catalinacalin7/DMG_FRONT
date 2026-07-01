import { CardHeader } from "@/components/ui/card";
import HailEstimateNav from "@/features/estimates/HailEstimateNav";
import { useTranslations } from "next-intl";

const EstimatesLayout = ({
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
      <HailEstimateNav />

      <div>{children}</div>
    </div>
  );
};

export default EstimatesLayout;
