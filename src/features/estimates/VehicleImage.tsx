"use client";

import { Camera, TrashIcon } from "lucide-react";
import { Panels } from "./constants/constants";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useParams } from "next/navigation";
import {
  deleteVehicleImage,
  getVehicleImages,
  uploadVehicleImage,
} from "@/api/estimates/estimates";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import LightboxGallery from "@/components/LightboxGallery/LightboxGallery";
import { useState } from "react";

function VehicleImage() {
  const t = useTranslations("PageEstimates");
  const [openLightbox, setOpenLightbox] = useState(false);
  const tUI = useTranslations("ui");
  const queryClient = useQueryClient();
  const { id: estimateId } = useParams();

  const { data: vehicleImages, isLoading: isLoading } = useQuery({
    queryKey: [QUERY_KEYS.vehicleImage, estimateId],
    queryFn: async () => await getVehicleImages(estimateId as string),
  });

  const uploadImages = useMutation({
    mutationKey: ["vehicleMedia"],
    mutationFn: async ({
      estimateId,
      formData,
    }: {
      estimateId: string;
      formData: any;
    }) => {
      await uploadVehicleImage(estimateId as string, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.vehicleImage, estimateId],
      });
    },
  });

  const handleUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    if (estimateId && files) {
      for (const file of files) {
        const formData = new FormData();
        formData.append("car-image", file);
        await uploadImages.mutate({
          estimateId: estimateId as string,
          formData: formData,
        });
      }
    }
  };

  const deleteImage = useMutation({
    mutationKey: ["vehicleMedia"],
    mutationFn: async ({ imageId }: { imageId: string }) => {
      await deleteVehicleImage(imageId as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.vehicleImage],
      });
    },
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-6 lg:grid-cols-3">
        {vehicleImages.length > 0 &&
          vehicleImages.map((item, index) => {
            return (
              <div key={item.id} className="w-full">
                <div className="relative h-[130px] md:h-[180px] lg:h-[180px] xl:h-[230px]">
                  <div
                    onClick={() => setOpenLightbox(true)}
                    className="h-full w-full cursor-pointer"
                  >
                    <img
                      alt="car"
                      src={item.url}
                      className="h-full w-full rounded-lg object-contain"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-2 top-2 h-8 w-8 p-1 drop-shadow-2xl"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (item.id) {
                        deleteImage.mutate({ imageId: item.id });
                      }
                    }}
                  >
                    <TrashIcon size={20} className="text-red-500" />
                  </Button>
                </div>
              </div>
            );
          })}
        <div className="relative flex h-[130px] cursor-pointer items-center justify-center rounded-lg bg-[#F8FAFC] px-4 py-4 md:h-[180px] lg:h-[180px] xl:h-[230px]">
          <div className="flex cursor-pointer flex-col items-center gap-2">
            <Camera size={24} className="text-[#64748B]" />
            <p className="text-sm text-[#64748B]">
              {tUI("buttons.clickToUploadImage")}
            </p>
          </div>
          <input
            name="panel-image"
            type="file"
            className="absolute bottom-0 left-0 right-0 top-0 h-full w-full cursor-pointer opacity-0"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(event) => handleUploadChange(event)}
            multiple
          />
        </div>
      </div>
      <LightboxGallery
        images={
          vehicleImages.length > 0
            ? vehicleImages?.map((image) => {
                return {
                  src: image.url,
                  title: "",
                  width: 3000,
                  height: 3000,
                };
              })
            : []
        }
        open={openLightbox}
        setOpen={() => setOpenLightbox(false)}
      />
    </>
  );
}
export default VehicleImage;
