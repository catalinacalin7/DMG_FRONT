"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Eye, LoaderCircle, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteVehicle, getAllVehicles } from "@/api/vehicles/vehicles";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/constants/queryKeys";
import DialogBox from "@/components/dialogs/DialogBox";
import { useTranslations } from "next-intl";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { CarLogo } from "./CarLogo";

const CarsList = () => {
  const [itemId, setItemId] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations("Garage");
  const tUI = useTranslations("ui");
  const { id } = useParams();
  const pathname = usePathname();
  const { toast } = useToast();

  const {
    data: clientVehicles,
    isLoading: isLoadingClientVehicles,
    refetch: refetchClientVehicles,
  } = useQuery({
    queryKey: [QUERY_KEYS.garages, id],
    queryFn: () => getAllVehicles(id as string),
  });

  const deleteCar = useMutation({
    mutationFn: async (id: string) => {
      await deleteVehicle(id);
    },
    onSuccess: async () => {
      await refetchClientVehicles();
    },
    onError: (error: AxiosError<any>) => {
      toast({
        title: "Delete vehicle",
        description: error.response?.data?.message
          ? error.response?.data?.message
          : "",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  return (
    <div className="flex flex-1 flex-col justify-between gap-5">
      <div className="flex justify-end">
        <Button size="lg" className="" asChild>
          <Link href={`${pathname}/add-vehicle`}>
            <Plus className="mr-1" />
            {tUI("buttons.addVehicle")}
          </Link>
        </Button>
      </div>

      {isLoadingClientVehicles ? (
        <LoaderCircle className="h-10 w-10 animate-spin self-center text-blue-600" />
      ) : clientVehicles && clientVehicles.length > 0 ? (
        <div className="flex flex-col gap-4">
          {clientVehicles.map((item) => (
            <div
              key={item.id}
              className="flex w-full gap-2 rounded-lg border shadow-sm md:flex-row"
            >
              <div className="h-55 flex w-20 items-center justify-center rounded-bl-lg rounded-tl-lg bg-blue-50 md:h-20 md:p-5">
                <CarLogo make={item.make} />
              </div>
              <div className="flex w-full items-center justify-between p-4">
                <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-4 md:gap-0">
                  <div className="flex flex-col">
                    <small>{t("make")}</small>
                    <h3 className="flex items-center text-base font-medium text-black">
                      {item.make}
                    </h3>
                  </div>
                  <div className="flex flex-col">
                    <small>{t("model")}</small>
                    <div className="flex items-center">
                      <h3 className="flex items-center text-base font-medium text-black">
                        {item.model}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <small>{t("vin")}</small>
                    <h3 className="flex items-center text-base font-medium text-black">
                      {item.vinNumber}
                    </h3>
                  </div>
                  <div className="flex gap-2 md:items-center md:justify-end">
                    <Button size={"sm"} variant={"secondary"}>
                      <Link
                        href={`/clients/${id}/garage/vehicle-info/${item.id}`}
                      >
                        <Eye size={18} className="text-muted-foreground" />
                      </Link>
                    </Button>
                    <Button size={"sm"} variant={"secondary"}>
                      <Link
                        href={`/clients/${id}/garage/edit-vehicle/${item.id}`}
                      >
                        <Pencil size={18} className="text-muted-foreground" />
                      </Link>
                    </Button>
                    <Button
                      size={"sm"}
                      variant={"secondary"}
                      onClick={(e) => {
                        setItemId(item.id);
                        setDialogOpen(true);
                      }}
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 text-center">
          <span className="rounded-full bg-blue-100 p-4">
            <Search className="text-blue-600" />
          </span>

          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">{t("noVehicleFound")}</h2>

            <p className="text-sm text-gray-300">
              {t("thereIsNotASingleCarnTheGarage")}
            </p>
          </div>
        </div>
      )}
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">
                {tUI("buttons.deleteVehicle")}
              </DialogTitle>
              <DialogDescription className="py-6 text-center text-base">
                {t("areYouSureYouWantDeleteThisVehicle")}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-row items-center justify-center gap-2 py-8 sm:flex sm:justify-center">
              <DialogClose asChild>
                <Button type="button" variant={"secondary"} size={"sm"}>
                  {tUI("buttons.cancel")}
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant={"destructive"}
                size={"sm"}
                onClick={() => {
                  setDialogOpen(false);
                  deleteCar.mutate(itemId as string);
                  setItemId(null);
                }}
              >
                {tUI("buttons.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CarsList;
