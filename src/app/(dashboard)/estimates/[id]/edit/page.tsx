"use client";

import { getCompany } from "@/api/company/company";
import {
  EstimateHail,
  EstimateHailPanel,
  getHailEstimateById,
} from "@/api/estimates/estimates";
import LoadingScreen from "@/components/LoadingScreen";
import { QUERY_KEYS } from "@/constants/queryKeys";
import EstimateHailFranceForm from "@/features/estimates/EstimateHailFranceForm";
import EstimateHailFranceFormV2 from "@/features/estimates/EstimateHailFranceFormV2";
import HailEstimateForm from "@/features/estimates/HailEstimateForm";
import HailEstimateManualForm from "@/features/estimates/HailEstimateManualForm";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

function EditHailEstimate() {
  const { id } = useParams();

  const { data: estimateHail, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.getHailEstimate, id],
    queryFn: () => getHailEstimateById(id as string),
    enabled: !!id,
  });

  const { data: companyData, isLoading: isLoadingCompanyData } = useQuery({
    queryKey: [QUERY_KEYS.companyInfo],
    queryFn: () => getCompany(),
  });

  const panels = estimateHail?.estimateHailPanel.map((panel: any) => {
    const { HailAddOns: addOns, ...restPanel } = panel;
    return { ...restPanel, addOns };
  }) as EstimateHailPanel[];

  delete estimateHail?.user;
  delete estimateHail?.createdAt;
  delete estimateHail?.updatedAt;

  const panelsWithoutIds = panels?.map((panel) => {
    return {
      panel: panel.panel,
      panelStatus: panel.panelStatus,
      light: panel.light,
      medium: panel.medium,
      strong: panel.strong,
      technicalDentsCount: panel.technicalDentsCount,
      technicalDentsCost: panel.technicalDentsCost,
      isAluminium: panel.isAluminium,
      lightQuotient: panel.lightQuotient,
      mediumQuotient: panel.mediumQuotient,
      strongQuotient: panel.strongQuotient,
      rAndI: panel.rAndI,
      comment: panel.comment,
      addOns:
        panel.addOns.length > 0
          ? panel.addOns.map((addOn) => {
              return {
                name: addOn.name,
                isPercentages: addOn.isPercentages,
                amount: addOn.amount,
              };
            })
          : panel.addOns,
      estimatePanelLabel:
        panel.estimatePanelLabel.length > 0
          ? panel.estimatePanelLabel.map((label) => {
              return {
                label: label.label,
              };
            })
          : panel.estimatePanelLabel,
    };
  });

  if (isLoading) return <LoadingScreen />;

  if (estimateHail.estimateMode === "manual") {
    return (
      <EstimateHailFranceFormV2
        estimateHail={
          {
            ...estimateHail,
            removeInstall: (Number(estimateHail.removeInstall) / 100).toFixed(
              2,
            ),
            retainedPrice: (Number(estimateHail.retainedPrice) / 100).toFixed(
              2,
            ),
            estimateHailPanel: panelsWithoutIds,
          } as EstimateHail
        }
        companyData={companyData}
        vehicleType={estimateHail?.vehicle?.vehicleType}
      />
    );
  }
  return (
    <HailEstimateForm
      estimateHail={
        { ...estimateHail, estimateHailPanel: panelsWithoutIds } as EstimateHail
      }
    />
  );
}
export default EditHailEstimate;
