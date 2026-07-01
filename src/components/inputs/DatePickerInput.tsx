import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format, Locale } from "date-fns";
import { ru, de, fr, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/utils/cn";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

type DatePickerProps = {
  fieldName: string;
  fieldLabel?: string | undefined;
  labelPosition?: "top" | "left";
  disabledPreviousDates?: boolean;
};

function DatePickerInput({
  fieldName,
  fieldLabel,
  labelPosition,
  disabledPreviousDates,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const tDate = useTranslations("Date");
  const locale = useLocale();
  const locales: Record<string, Locale> = {
    ru: ru,
    de: de,
    fr: fr,
    en: enUS,
  };
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem
            className={`grid grid-cols-1 place-items-start justify-items-start gap-0 ${labelPosition === "top" ? "" : "lg:grid-cols-2 lg:gap-4 xl:grid-cols-3"}`}
          >
            <FormLabel className="text-nowrap text-base lg:pr-14">
              {fieldLabel}
            </FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="w-full rounded-md">
                <FormControl className="w-full">
                  <Button
                    variant={"outline"}
                    size="lg"
                    className={cn(
                      "pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "LLL dd, y", {
                        locale: locales[locale],
                      })
                    ) : (
                      <span>{tDate("pickADate")}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(value) => {
                    field.onChange(value.toISOString());
                    setOpen(false);
                  }}
                  disabled={
                    disabledPreviousDates && ((date) => date < new Date())
                  }
                  weekStartsOn={1}
                  locale={locales[locale]}
                />
              </PopoverContent>
            </Popover>

            <FormMessage className="text-red-500" />
          </FormItem>
        );
      }}
    />
  );
}
export default DatePickerInput;
