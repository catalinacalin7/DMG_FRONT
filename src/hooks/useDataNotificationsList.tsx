"use client";
import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeEstimateStatus,
  EstimateHail,
  EstimateStatus,
  getHailEstimates,
} from "@/api/estimates/estimates";
import { toast } from "@/components/ui/use-toast";
import { EstimatesStatusType } from "@/types/estimates";
import { getEstimatesFor } from "@/api/home-dashboard/home-dashboard";

export const useDataNotificationsList = (
  searchQueryDebounced: string,
  status?: string,
) => {
  const tEstimates = useTranslations("PageEstimates");

  const {
    data: estimates,
    isLoading: isLoadingEstimates,
    refetch: refetchEstimates,
  } = useQuery<EstimateHail[]>({
    queryKey: ["estimates-notification"],
    queryFn: async () =>
      await getEstimatesFor({
        searchQuery: searchQueryDebounced,
        status:
          status === EstimatesStatusType.all
            ? ""
            : EstimatesStatusType.waitingApprove,
      }),
  });

  const queryClient = useQueryClient();

  const estimateStatusMutation = useMutation({
    mutationFn: async ({ data, id }: { data: EstimateStatus; id: string }) => {
      await changeEstimateStatus(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["estimates-notification"],
      });
      toast({
        title: tEstimates("hailEstimate"),
        description: tEstimates("estimateStatusHasBeenUpdated"),
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: tEstimates("hailEstimate"),
        description: tEstimates("thereWasAProblemWithYourRequest"),
        variant: "destructive",
      });
    },
  });

  return {
    data: estimates,
    isLoading: isLoadingEstimates,
    refetch: refetchEstimates,
    estimateStatusMutation,
  };
};
