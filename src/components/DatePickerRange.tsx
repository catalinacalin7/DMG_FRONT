"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { CalendarIcon } from "lucide-react";
import { format, Locale } from "date-fns";
import { de, enUS, fr, ru } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/utils/cn";

type DateRangeProps = {
  onDataChange?: (date: DateRange | undefined) => void;
  resetTrigger?: boolean;
};

type stepType = "from" | "to";

export const DatePickerRange = ({
  onDataChange,
  resetTrigger,
}: DateRangeProps) => {
  const tDate = useTranslations("Date");
  const locale = useLocale();
  const locales: Record<string, Locale> = {
    ru: ru,
    de: de,
    fr: fr,
    en: enUS,
  };
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState<stepType>("from");

  const handleSelect = (date: Date | undefined) => {
    if (step === "from") {
      setFrom(date);
      setTo(undefined);
      setStep("to");
    } else if (step === "to") {
      if (from && date && date >= from) {
        setTo(date);
        setStep("from");

        onDataChange?.({ from, to: date });
        setOpen(false);
      } else {
        setTo(undefined);
      }
    }
  };

  const displayText =
    from && to
      ? `${format(from, "LLL dd, y", { locale: locales[locale] })} - ${format(to, "LLL dd, y", { locale: locales[locale] })}`
      : from
        ? `${format(from, "LLL dd, y", { locale: locales[locale] })} →`
        : tDate("pickADate");

  useEffect(() => {
    setFrom(undefined);
    setTo(undefined);
    setStep("from");
  }, [resetTrigger]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="h-10 w-full rounded-md">
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "pl-3 text-left font-normal",
            !from && "text-muted-foreground",
          )}
        >
          <span className="mr-2">{displayText}</span>
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={step === "from" ? from : to}
          onSelect={handleSelect}
          defaultMonth={from || new Date()}
          initialFocus
          locale={locales[locale]}
        />
      </PopoverContent>
    </Popover>
  );
};
