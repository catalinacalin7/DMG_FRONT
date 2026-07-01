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
import { getAllClients, getClientsFor } from "@/api/client/get-all";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

function ClientSearchSelector() {
  const t = useTranslations("PageEstimates");
  const tButton = useTranslations("ui");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const { control, setValue } = useFormContext();

  const { data: clients } = useQuery({
    queryKey: [QUERY_KEYS.clients],
    queryFn: getClientsFor,
  });

  return (
    <FormField
      control={control}
      name="clientId"
      render={({ field: { value } }) => {
        return (
          <FormItem className="w-full gap-0">
            <FormLabel className="text-base">{t("client")}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-10 w-full rounded-lg"
                  >
                    {value
                      ? clients?.find((client) => client.id === value)?.name
                      : tButton("placeholders.searchClient")}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popper-anchor-width) flex flex-col gap-2">
                {clients && clients.length > 0 ? (
                  <Command>
                    <CommandInput
                      placeholder={tButton("placeholders.searchClient")}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>{t("noClientFound")}</CommandEmpty>
                      <CommandGroup>
                        {clients?.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={client.id}
                            onSelect={() => {
                              setValue("clientId", client.id);
                              setOpen(false);
                            }}
                          >
                            {client.name}
                            {value === client.id && (
                              <Check className="ml-auto h-4 w-4 text-blue-600" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p>{t("noClientFound")}</p>
                  </div>
                )}
                <div className="flex justify-center">
                  <Button size="sm">
                    <Link href={`/clients/add-client?redirectUrl=${pathname}`}>
                      {tButton("buttons.addClient")}
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
export default ClientSearchSelector;
