"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { getAllVehicles, getVehiclesFor } from "@/api/vehicles/vehicles";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

function VehicleSearchSelector() {
  const t = useTranslations("PageEstimates");
  const tButton = useTranslations("ui");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { control, watch, setValue } = useFormContext();

  const { clientId, vehicleId, carBody } = watch();

  const { data: vehicles } = useQuery({
    queryKey: [QUERY_KEYS.garages, clientId],
    queryFn: () => getVehiclesFor(clientId as string),
    enabled: !!clientId,
  });
  const selected = vehicles?.find((vehicle) => vehicle.id === vehicleId);
  useEffect(() => {
    if (selected && !carBody) {
      setValue("carBody", selected.vehicleType);
    }
  }, [carBody, selected, setValue]);
  return (
    <FormField
      control={control}
      name="vehicleId"
      render={({ field: { value } }) => {
        const selectedVehicle = vehicles?.find(
          (vehicle) => vehicle.id === value,
        );

        return (
          <FormItem className="w-full gap-0">
            <FormLabel className="text-base">{t("vehicle")}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild disabled={!clientId}>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-10 w-full rounded-lg"
                  >
                    {selectedVehicle
                      ? `${selectedVehicle.registrationNumber ? selectedVehicle.registrationNumber : ""} ${selectedVehicle.make}, ${selectedVehicle.model}, ${selectedVehicle.year}`
                      : tButton("placeholders.selectACar")}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popper-anchor-width) flex flex-col gap-2">
                {vehicles && vehicles.length > 0 ? (
                  <Command>
                    <CommandInput
                      placeholder={tButton("placeholders.searchCar")}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>{t("noCarFound")}</CommandEmpty>
                      <CommandGroup>
                        {vehicles?.map((vehicle) => (
                          <CommandItem
                            key={vehicle.id}
                            value={vehicle.id}
                            onSelect={() => {
                              setValue("vehicleId", vehicle.id);

                              setValue("carBody", vehicle.vehicleType);
                              vehicle.registrationNumber
                                ? setValue(
                                    "registrationNumber",
                                    vehicle?.registrationNumber,
                                  )
                                : setValue("registrationNumber", "");
                              setOpen(false);
                            }}
                          >
                            {`${vehicle?.registrationNumber ? vehicle.registrationNumber : ""}, ${vehicle.make} ${vehicle.model}`}
                            {value === vehicle.id && (
                              <Check className="ml-auto h-4 w-4 text-blue-600" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                ) : (
                  <p>{t("noCarFound")}</p>
                )}
                <div className="flex justify-center">
                  <Button size="sm">
                    <Link
                      href={`/clients/${clientId}/garage/add-vehicle?redirectUrl=${pathname}`}
                    >
                      {tButton("buttons.addVehicle")}
                    </Link>
                  </Button>
                </div>
              </PopoverContent>
              <FormMessage />
            </Popover>
          </FormItem>
        );
      }}
    />
  );
}
export default VehicleSearchSelector;
