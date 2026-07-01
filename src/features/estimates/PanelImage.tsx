"use client";

import { Camera, TrashIcon } from "lucide-react";
import { Panels } from "./constants/constants";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useParams } from "next/navigation";
import {
  deletePanelImage,
  getPanelImages,
  uploadPanelImage,
} from "@/api/estimates/estimates";
import type { PanelImage } from "@/api/estimates/estimates";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import { useState } from "react";
import LightboxGallery from "@/components/LightboxGallery/LightboxGallery";
import { Spinner } from "@/components/ui/spinner";

function PanelImage() {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [uploadPanel, setUploadPanel] = useState("");
  const t = useTranslations("PageEstimates");
  const tActions = useTranslations("ToastActions");
  const queryClient = useQueryClient();
  const { id: estimateId } = useParams();

  const { data: panelImages, isLoading: isLoading } = useQuery({
    queryKey: [QUERY_KEYS.panelImage, estimateId],
    queryFn: async () => await getPanelImages(estimateId as string),
  });

  const uploadImages = useMutation({
    mutationKey: ["panelMedia"],
    mutationFn: async ({
      estimateId,
      formData,
    }: {
      estimateId: string;
      formData: any;
    }) => {
      await uploadPanelImage(estimateId as string, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.panelImage, estimateId],
      });
      setUploadPanel("");
    },
  });

  const handleUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    panel: string,
  ) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    if (estimateId && files) {
      const formData = new FormData();
      formData.append("panel", panel);
      formData.append("panel-image", files[0]);
      uploadImages.mutate({
        estimateId: estimateId as string,
        formData: formData,
      });
    }
  };

  const image = (panel: string) =>
    panelImages.length > 0
      ? panelImages.find((item) => item.panel === panel)
      : undefined;

  const deleteImage = useMutation({
    mutationKey: ["panelMedia"],
    mutationFn: async ({ imageId }: { imageId: string }) => {
      await deletePanelImage(imageId as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.panelImage],
      });
    },
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-6 lg:grid-cols-3">
        {Panels.map((panel) => {
          return (
            <div key={panel} className="w-full">
              {image(panel) ? (
                <div className="relative h-[130px] md:h-[180px] lg:h-[180px] xl:h-[230px]">
                  <div
                    onClick={() => setOpenLightbox(true)}
                    className="h-full w-full cursor-pointer"
                  >
                    <img
                      alt="car"
                      src={image(panel).url}
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
                      if (image(panel).id) {
                        deleteImage.mutate({ imageId: image(panel).id });
                      }
                    }}
                  >
                    <TrashIcon size={20} className="text-red-500" />
                  </Button>
                </div>
              ) : (
                <div className="relative flex h-[130px] cursor-pointer items-center justify-center rounded-lg bg-[#F8FAFC] px-4 py-4 md:h-[180px] lg:h-[180px] xl:h-[230px]">
                  {uploadImages.isPending && panel === uploadPanel ? (
                    <>
                      <div className="flex cursor-pointer flex-col items-center gap-2">
                        <Spinner className="size-8" />
                        <p className="text-sm text-[#64748B]">
                          {tActions("uploading")}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex cursor-pointer flex-col items-center gap-2">
                        <Camera size={24} className="text-[#64748B]" />
                        <p className="text-sm text-[#64748B]">{t(panel)}</p>
                      </div>
                      <input
                        name="panel-image"
                        type="file"
                        className="absolute bottom-0 left-0 right-0 top-0 h-full w-full cursor-pointer opacity-0"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(event) => {
                          setUploadPanel(panel);
                          handleUploadChange(event, panel);
                        }}
                        multiple
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <LightboxGallery
        images={
          panelImages.length > 0
            ? panelImages?.map((image) => {
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
export default PanelImage;
