"use client";
import { ArrowLeft, ArrowRight, Trash2 as TrashIcon } from "lucide-react";

import {
  deleteScheduleEventById,
  getScheduleEvents,
} from "@/api/schedule/schedule";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { ScheduleEvent } from "@/types/schedule";
import { cn } from "@/utils/cn";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  isWeekend,
  Locale,
  setMonth,
  startOfDay,
  startOfMonth,
  isEqual,
} from "date-fns";
import { ru, de, fr, enUS } from "date-fns/locale";
import React, { useState } from "react";

import DialogBox from "@/components/dialogs/DialogBox";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [todaysEvents, setTodayEvents] = useState<ScheduleEvent[]>([]);

  const queryClient = useQueryClient();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const locale = useLocale();
  const t = useTranslations("PageScheduling");
  const tButton = useTranslations("ui");
  const tDate = useTranslations("Date");

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const stardingDayIndex = (getDay(firstDayOfMonth) + 6) % 7;

  const { data: scheduleData, isLoading: isScheduleDataLoading } = useQuery({
    queryKey: ["ScheduleEvents"],
    queryFn: () => getScheduleEvents(),
  });
  const deleteScheduleEvent = useMutation({
    mutationFn: (id: string) => deleteScheduleEventById(id),
    onSuccess: (_, id) => {
      setTodayEvents((prev) => prev.filter((item) => item.id !== id));
      queryClient.invalidateQueries({
        queryKey: ["ScheduleEvents"],
      });
    },
  });

  const changeMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const month = setMonth(
        prevDate,
        prevDate.getMonth() + (direction === "next" ? 1 : -1),
      );
      setCurrentDay(month);
      return month;
    });
    setTodayEvents([]);
  };

  const changeDay = (direction: "prev" | "next") => {
    setCurrentDay((prevDate) => {
      const day = addDays(prevDate, direction === "next" ? 1 : -1);

      if (scheduleData) {
        const todaysEvents = scheduleData[startOfDay(day).toISOString()] || [];

        setTodayEvents(todaysEvents);
      }
      return day;
    });
  };

  if (isScheduleDataLoading) {
    return <LoadingScreen />;
  }
  const locales: Record<string, Locale> = {
    ru: ru,
    de: de,
    fr: fr,
    en: enUS,
  };

  return (
    <div className="">
      <div className="flex items-center justify-between px-1 py-2 pb-6 sm:px-2">
        <h3 className="text-base font-bold lg:text-3xl">
          {t("monthlyEvents")}
        </h3>
        <Button size="lg">
          <Link href={`/scheduling/create`} className="text-sm">
            {tButton("buttons.create")}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start md:gap-12">
        <div className="w-full md:max-w-[300px]">
          <div className="mx-auto rounded-lg border px-1 py-2 sm:px-2 md:mx-0">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <Button
                variant="secondary"
                size="icon"
                type="button"
                onClick={() => changeMonth("prev")}
                className="h-8"
              >
                <ArrowLeft className="w-4" />
              </Button>
              <h2 className="bg-brand-dark rounded-lg p-2 text-center text-xs text-white">
                {format(currentDate, "MMMM yyyy", {
                  locale: locales[locale],
                })}
              </h2>
              <Button
                variant="secondary"
                size="icon"
                type="button"
                onClick={() => changeMonth("next")}
                className="h-8"
              >
                <ArrowRight className="w-4" />
              </Button>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-7 gap-2 md:mx-0">
            {WEEKDAYS.map((day) => {
              const todayName = format(new Date(), "EE");
              const isSameWeekday = day === todayName;
              return (
                <p
                  key={day}
                  className={cn("my-2 text-center", {
                    "font-bold": isSameWeekday,
                  })}
                >
                  {tDate(day)}
                </p>
              );
            })}
            {Array.from({ length: stardingDayIndex }).map((_, index) => {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-10 rounded-lg border p-2 text-center"
                />
              );
            })}

            {daysInMonth.map((day, index) => {
              const todaysEvents =
                (scheduleData && scheduleData[day.toISOString()]) || [];

              return (
                <div
                  key={index}
                  onClick={() => {
                    setTodayEvents(todaysEvents);
                    setCurrentDay(day);
                    setSelectedIndex(index);
                  }}
                  className={cn(
                    "flex h-10 cursor-pointer flex-col justify-start gap-1 rounded-lg border p-1 text-center",
                    {
                      "bg-blue-200": isToday(day) && !isWeekend(day),
                      "font-bold": isToday(day),
                      "bg-slate-200": isWeekend(day),
                      "border-2 border-green-400": selectedIndex === index,
                    },
                  )}
                >
                  <div className="text-center text-xs">{format(day, "d")}</div>

                  <div className="flex flex-wrap gap-1">
                    {todaysEvents.map((event: ScheduleEvent) => {
                      return (
                        <div
                          key={event.id}
                          className="bg-brand-dark h-1 w-1 rounded-full"
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full">
          <div className="mx-auto rounded-lg border px-1 py-2 sm:px-2 md:mx-0 md:max-w-full">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <Button
                variant="secondary"
                size="icon"
                type="button"
                onClick={() => {
                  changeDay("prev");
                }}
                className="h-8"
              >
                <ArrowLeft className="w-4" />
              </Button>
              <h2 className="bg-brand-dark rounded-lg p-2 text-center text-xs text-white">
                {format(currentDay, "EEEE, dd MMMM ", {
                  locale: locales[locale],
                })}
              </h2>
              <Button
                variant="secondary"
                size="icon"
                type="button"
                onClick={() => changeDay("next")}
                className="h-8"
              >
                <ArrowRight className="w-4" />
              </Button>
            </div>
          </div>
          <div className="mx-auto flex w-full flex-col gap-2 pt-4 sm:pt-2 md:mx-0 md:max-w-full">
            {todaysEvents.map((event) => {
              return (
                <div
                  key={event.id}
                  className="bg-brand-dark relative rounded-lg px-2 py-1 text-white"
                >
                  <div className="flex justify-start">
                    <Link href={`/scheduling/${event.id}`} className="w-full">
                      <div className="flex gap-1">
                        <p className="text-[10px] font-light">{event.time}</p>
                        <p className="text-[10px] font-light">
                          {event.serviceName}
                        </p>
                      </div>
                      <p className="text-left text-[10px] font-light">
                        {event.assigneeName}
                      </p>

                      <p className="text-left text-xs font-normal">
                        {event.eventLocation}
                      </p>
                    </Link>
                    <div className="absolute right-2 top-1 z-40">
                      <DialogBox
                        dialogTriggerName="Delete"
                        dialogTitle="Delete Event"
                        dialogDescription="Are you sure you want delete this event?"
                        open={isDialogOpen}
                        onOpenChange={setDialogOpen}
                        onAction={() => {
                          deleteScheduleEvent.mutate(event?.id as string);
                        }}
                        triggerIcon={
                          <TrashIcon size={12} className="text-red-500" />
                        }
                        triggerVariant="secondary"
                        triggerClassname="h-5 w-5 p-0 rouned-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
