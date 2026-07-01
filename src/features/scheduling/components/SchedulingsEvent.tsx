"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteScheduleEventById,
  getScheduleEventById,
} from "@/api/schedule/schedule";
import { useParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import DialogBox from "@/components/dialogs/DialogBox";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const SchedulingsEvent = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("PageScheduling");
  const tActions = useTranslations("ToastActions");

  const { data, isLoading } = useQuery({
    queryKey: ["event"],
    queryFn: () => getScheduleEventById(id as string),
    enabled: id ? true : false,
  });

  const deleteScheduleEvent = useMutation({
    mutationFn: (id: string) => deleteScheduleEventById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ScheduleEvents"],
      });
      toast.success(t("scheduling"), {
        description: tActions("deleted"),
      });
      router.push("/scheduling");
    },
    onError: () => {
      toast.error(t("scheduling"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <p className="text-xl font-bold">Event Details</p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="lg"
            onClick={() => router.push(`/scheduling/${data?.id}/edit`)}
          >
            Edit
          </Button>

          <DialogBox
            dialogTriggerName="Delete"
            dialogTitle="Delete Event"
            dialogDescription="Are you sure you want delete this event?"
            open={isDialogOpen}
            onOpenChange={setDialogOpen}
            onAction={() => {
              deleteScheduleEvent.mutate(data?.id as string);
            }}
            triggerVariant="destructive"
            triggerSize="lg"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div>
          <p className="text-xs font-bold">Date</p>
          <p>{dayjs(data?.date).format("DD-MM-YYYY")}</p>
        </div>
        <div>
          <p className="text-xs font-bold">Time</p>
          <p>{data?.time}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 border p-2">
          <div>
            <p className="text-xs font-bold text-gray-300">Service</p>
            <p>{data?.serviceName}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-300">Client</p>
            <p>{data?.client.name}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-300">Location</p>
            <p>{data?.eventLocation}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-300">Car</p>
            <p>
              {data?.vehicle?.make} {data?.vehicle?.model} {data?.vehicle?.year}{" "}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-300">Vin</p>
            <p> {data?.vehicle?.vinNumber}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 border p-2">
          <div>
            <p className="text-xs font-bold text-gray-300">Member</p>
            <p> {data?.assigneeName}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-300">Role</p>
            <p> {data?.assigneeName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingsEvent;
