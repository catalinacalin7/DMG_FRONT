"use client";

import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/components/LoadingScreen";
import WorkflowColumn from "./WorkflowColumn";
import { getWorkflows, WorkflowItem } from "@/api/workflow/workflow";
import { QUERY_KEYS } from "@/constants/queryKeys";

function Workflows({
  clientName,
  companyMember,
  searchQuery,
}: {
  clientName: string;
  companyMember: string;
  searchQuery: string;
}) {
  const { data: workflows, isLoading: isLoadingWorkflows } = useQuery({
    queryKey: [QUERY_KEYS.getWorkflows, clientName, companyMember, searchQuery],
    queryFn: () => getWorkflows(clientName, companyMember, searchQuery),
  });

  if (isLoadingWorkflows) {
    return <LoadingScreen />;
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      <WorkflowColumn
        items={
          workflows?.filter((item) => item.status === "new") as WorkflowItem[]
        }
        status="NEW"
      />

      <WorkflowColumn
        items={
          workflows?.filter(
            (item) => item.status === "in_progress",
          ) as WorkflowItem[]
        }
        status="IN PROGRESS"
      />

      <WorkflowColumn
        items={
          workflows?.filter(
            (item) => item.status === "completed",
          ) as WorkflowItem[]
        }
        status="COMPLETED"
      />
    </div>
  );
}
export default Workflows;
