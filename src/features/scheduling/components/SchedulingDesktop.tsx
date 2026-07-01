"use client";
import dayjs from "dayjs";
import { CalendarRange, Trash2 as TrashIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteScheduleEventById,
  getScheduleEvents,
} from "@/api/schedule/schedule";
import { ScheduleEvent } from "@/types/schedule";
import DialogBox from "@/components/dialogs/DialogBox";
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const SchedulingDesktop = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const t = useTranslations("PageScheduling");
  const tActions = useTranslations("ToastActions");
  const today = dayjs();
  const formattedToday = today.format("DD-MM-YYYY");
  const days = Array.from({ length: 14 }, (_, i) =>
    today.add(i, "day").format("DD-MM-YYYY"),
  );
  const router = useRouter();
  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM

  const { data: scheduleData, isLoading: isScheduleDataLoading } = useQuery({
    queryKey: ["ScheduleEvents"],
    queryFn: () => getScheduleEvents(),
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
    },
    onError: () => {
      toast.error(t("scheduling"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  if (isScheduleDataLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-background flex w-full flex-col rounded-lg">
      {/* Header */}
      <div className="flex w-full items-center justify-between rounded-t-lg bg-[#2F74FA] p-2 text-white md:px-5 md:py-4">
        <Select defaultValue="week">
          <SelectTrigger className="h-7 max-w-[100px] rounded-lg border-none bg-[#549CFD] text-sm font-medium md:h-9 md:px-3 md:py-[6px] md:text-base">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 rounded-lg bg-[#549CFD] p-1 font-medium text-white md:px-3 md:py-[6px]">
          <CalendarRange className="h-5 w-5 text-white" />
          <span className="text-sm">{formattedToday}</span>
        </div>

        <Button type="button" size="lg">
          <Link href="/scheduling/create">Create</Link>
        </Button>
      </div>

      <div className="flex w-full flex-1">
        {/* Time Slots */}
        <div className="w-10 border-r pt-[65px] md:w-16">
          {hours.map((hour, i) => (
            <div
              key={hour}
              className={cn(
                "h-40 border-b text-center text-xs font-bold text-[#72767C]",
              )}
            >
              {hour}:00
            </div>
          ))}
        </div>

        <div className="w-full overflow-x-scroll">
          <div className="max-w-96">
            {/* Day Labels */}
            <div className="h-max w-max">
              <div className="flex w-full justify-between border-b">
                {days.map((day, i) => (
                  <div
                    key={day}
                    className={cn(
                      "text-md h-16 w-[200px] border-r p-1 py-2 text-center font-bold text-[#72767C]",
                    )}
                  >
                    {day}
                  </div>
                ))}
              </div>
              {/* Event Columns */}
              <div className="flex">
                {days.map((day) => {
                  const eventsForDay = Object.entries(
                    scheduleData ?? [],
                  ).filter((event: any) => {
                    if (dayjs(event[0]).format("DD-MM-YYYY") === day) {
                      return event;
                    }
                  });

                  return (
                    <div
                      key={day}
                      className={cn("relative w-[200px] border-r p-0")}
                    >
                      {hours.map((hour) => {
                        const eventByHour = eventsForDay.filter((event) => {
                          return (
                            Number(event[1][0].time.split(":")[0]) === hour
                          );
                        });

                        return (
                          <div
                            key={`${day}-${hour}`}
                            className="h-40 overflow-y-auto border-b p-1"
                          >
                            {eventByHour.map((item) => {
                              const events =
                                item[1] as unknown as ScheduleEvent[];

                              const sortedEvents = events.sort(
                                (a: ScheduleEvent, b: ScheduleEvent) =>
                                  a.time
                                    .split(":")[1]
                                    .localeCompare(b.time.split(":")[1]),
                              ) as unknown as ScheduleEvent[];

                              return sortedEvents.map((event) => {
                                return (
                                  <div
                                    key={event.id}
                                    className="relative rounded-xl border-2 border-[#D4E6FF] bg-blue-600 px-2 py-1 text-white"
                                  >
                                    <div className="flex justify-between text-xs">
                                      <Link
                                        href={`/scheduling/${event.id}`}
                                        className="w-full"
                                      >
                                        <p> {event.companyMember.user.name}</p>
                                        <div className="flex gap-1">
                                          <p className="text-[10px]">
                                            {event.time}
                                          </p>
                                          <p className="text-[10px]">
                                            {event.serviceName}
                                          </p>
                                        </div>
                                        <p className="text-xs font-semibold">
                                          {event.eventLocation}
                                        </p>
                                      </Link>
                                      <div className="absolute right-1 top-1 z-40">
                                        <DialogBox
                                          dialogTriggerName="Delete"
                                          dialogTitle="Delete Event"
                                          dialogDescription="Are you sure you want delete this event?"
                                          open={isDialogOpen}
                                          onOpenChange={setDialogOpen}
                                          onAction={() => {
                                            deleteScheduleEvent.mutate(
                                              event?.id as string,
                                            );
                                          }}
                                          triggerIcon={
                                            <TrashIcon
                                              size={14}
                                              className="text-red-500"
                                            />
                                          }
                                          triggerVariant="secondary"
                                          triggerClassname="h-6 w-6 p-1 rouned-none"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              });
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingDesktop;
