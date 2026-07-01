import { updateWorkflowStatus, WorkflowItem } from "@/api/workflow/workflow";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { WorkflowStatus } from "@/api/workflow/workflow";
import { useTranslations } from "next-intl";

type WorkflowDesktopItemProps = {
  items: WorkflowItem[];
  status: "NEW" | "IN PROGRESS" | "COMPLETED";
};

const WorkflowColumn = ({ items, status }: WorkflowDesktopItemProps) => {
  const t = useTranslations("PageWorkflow");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const workflowStatusUpdate = useMutation({
    mutationFn: async ({
      status,
      id,
    }: {
      status: WorkflowStatus;
      id: string;
    }) => {
      await updateWorkflowStatus(status, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getWorkflows],
      });
      toast({
        title: t("workflow"),
        description: t("workflowHasBeenUpdated"),
      });
    },
    onError: () => {
      toast({
        title: t("workflow"),
        description: t("thereWasAProblemWithYourRequest"),
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <div
            className={cn(
              "flex h-2 w-2 items-center justify-center rounded-full",
              {
                "bg-blue-600": status === "NEW",
                "bg-yellow-300": status === "IN PROGRESS",
                "bg-green-600": status === "COMPLETED",
              },
            )}
          />
          <p className="text-nowrap text-sm">{t(status.toLowerCase())}</p>
          <p className="flex h-3 w-3 items-center justify-center rounded-full bg-gray-100 p-[9px] text-xs">
            {items && items.length}
          </p>
        </div>
      </div>
      <Separator
        className={cn("my-4 h-1", {
          "bg-blue-600": status === "NEW",
          "bg-yellow-300": status === "IN PROGRESS",
          "bg-green-600": status === "COMPLETED",
        })}
      />
      <div className="flex flex-col gap-3">
        {items?.map((item: WorkflowItem, index: number) => {
          return (
            <React.Fragment key={index}>
              <div className="flex w-full items-start justify-between">
                <div className="grid w-full grid-cols-12 gap-2">
                  <div className="col-span-12 xl:col-span-7">
                    <p className="text-xs">{item.serviceName}</p>
                    <p className="text-xs font-semibold">
                      {item?.client?.name}
                    </p>
                  </div>
                  <div className="col-span-12 xl:col-span-5">
                    <p className="text-xs">{item?.assigneeName}</p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary" className="h-5 w-5">
                      <EllipsisVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => {
                          workflowStatusUpdate.mutate({
                            status: WorkflowStatus.new,
                            id: item.id,
                          });
                        }}
                      >
                        {t("new")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          workflowStatusUpdate.mutate({
                            status: WorkflowStatus.inProgress,
                            id: item.id,
                          });
                        }}
                      >
                        {t("in progress")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          workflowStatusUpdate.mutate({
                            status: WorkflowStatus.completed,
                            id: item.id,
                          });
                        }}
                      >
                        {t("completed")}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Separator className="h-px bg-[#f0f0f0]" />
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
};

export default WorkflowColumn;
