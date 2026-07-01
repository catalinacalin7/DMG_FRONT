import { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Estimates",
};

const EstimatesPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="rounded-none lg:rounded-lg">
      <div className="">{children}</div>
    </div>
  );
};

export default EstimatesPageLayout;
