"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";

import React, { useState } from "react";
import { deleteMember, getMembers } from "@/api/company/members";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/constants/queryKeys";
import DialogBox from "@/components/dialogs/DialogBox";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";

const TeamMembersList = () => {
  const t = useTranslations("Settings.Team");
  const tUI = useTranslations("ui");
  const tActions = useTranslations("ToastActions");
  const tNav = useTranslations("Navigation");
  const queryClient = useQueryClient();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const {
    data: membersListData,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: [QUERY_KEYS.members],
    queryFn: () => getMembers(),
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (memberId: number) => {
      await deleteMember(memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.members],
      });
      toast.success(tNav("team"), {
        description: tActions("deleted"),
      });
    },
    onError: () => {
      toast.error(t("estimate"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">
          {t("teamMembers")}
        </h3>
        <Link href={`/settings/team/add`} className="">
          <Button size="lg" className="w-full">
            {tUI("buttons.addTeamMember")}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {membersListData && membersListData.length > 0 ? (
          membersListData?.map((item) => {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border px-4 py-5 shadow-sm"
              >
                <div>
                  <h3 className="flex items-center text-base font-medium text-black">
                    {item?.user?.name} (
                    {item?.user?.role && t(item?.user?.role?.toLowerCase())})
                  </h3>

                  <p className="text-sm text-black">{item.user.email}</p>
                </div>

                <div className="flex items-center justify-center gap-2 md:justify-end">
                  <Button size={"sm"} variant={"secondary"}>
                    <Link href={`/settings/team/edit/${item.id}`}>
                      <Pencil size={18} className="text-muted-foreground" />
                    </Link>
                  </Button>

                  <DialogBox
                    dialogTriggerName={tUI("buttons.delete")}
                    dialogTitle={t("deleteTeamMember")}
                    dialogDescription={t("deleteTeamMember")}
                    open={isDialogOpen}
                    onOpenChange={setDialogOpen}
                    onAction={() => {
                      deleteMemberMutation.mutate(item.id);
                    }}
                    triggerIcon={<Trash2 size={18} className="text-red-500" />}
                    triggerVariant="secondary"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground text-center text-sm font-semibold">
            {t("noMembers")}
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamMembersList;
