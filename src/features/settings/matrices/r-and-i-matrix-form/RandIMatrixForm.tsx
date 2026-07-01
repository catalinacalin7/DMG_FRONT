"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRandIMatrix } from "@/api/matrices/rAndi-matrix";
import { createRandIMatrix } from "@/api/matrices/rAndi-matrix";
import { updateRandIMatrix } from "@/api/matrices/rAndi-matrix";
import LoadingScreen from "@/components/LoadingScreen";
import NumericInput from "@/components/inputs/NumericInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { RemoveAndInstallMatrix } from "@/types/matrices";
import { rAndIMatrixSchema, RandIMatrixSchema } from "./schema";
import { RANDI_DEFAULT } from "@/constants/default-matrices";
import { toast } from "sonner";

const defaultFormValues = {
  ...RANDI_DEFAULT,
};

function RandIMatrixForm() {
  const t = useTranslations("Settings.Matrix");
  const tUI = useTranslations("ui");
  const tCarParts = useTranslations("PageEstimates");
  const tActions = useTranslations("ToastActions");
  const tNav = useTranslations("Navigation");
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: rAndiMatrix, isLoading: isLoadingRandIMatrix } = useQuery({
    queryKey: [QUERY_KEYS.rAndiMatrix],
    queryFn: () => getRandIMatrix(id as string),
  });

  const form = useForm<RandIMatrixSchema>({
    values: id && rAndiMatrix ? { ...rAndiMatrix } : defaultFormValues,
    resolver: yupResolver(rAndIMatrixSchema),
    mode: "onChange",
  });

  const createMatrix = useMutation({
    mutationFn: async (formData: RemoveAndInstallMatrix) => {
      await createRandIMatrix({
        ...formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.createRandIMatrix],
      });
      toast.success(tNav("matrix"), {
        description: tActions("created"),
      });
      router.push(`/settings/matrix`);
    },
    onError: () => {
      toast.error(tNav("matrix"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const updateMatrix = useMutation({
    mutationFn: async (formData: RemoveAndInstallMatrix) => {
      await updateRandIMatrix(
        {
          ...formData,
        },
        rAndiMatrix?.id as string,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.updateRandIMatrix],
      });
      toast.success(tNav("matrix"), {
        description: tActions("updated"),
      });
      router.push(`/settings/matrix`);
    },
    onError: () => {
      toast.error(tNav("matrix"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  if (isLoadingRandIMatrix) return <LoadingScreen />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formData) => {
          if (id) {
            updateMatrix.mutate(formData as any);
          } else {
            createMatrix.mutate(formData as any);
          }
        })}
      >
        {/* <div className="py-2 lg:border-b lg:py-6">
          <TextInput fieldName="name" fieldLabel={t("r&IMatrixUniqueName")} />
        </div> */}

        <div>
          <div className="grid grid-cols-2 rounded-tl-md rounded-tr-md bg-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              {tCarParts("panel")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              {tCarParts("price")}
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("hood")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="hood" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("leftFrontFender")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="leftFrontFender" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("rightFrontFender")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="rightFrontFender" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("leftFrontDoor")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="leftFrontDoor" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("rightFrontDoor")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="rightFrontDoor" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("leftRearDoor")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="leftRearDoor" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("rightRearDoor")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="rightRearDoor" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("roof")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="roof" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("leftRail")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="leftRail" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("rightRail")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="rightRail" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("leftQuarter")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="leftQuarter" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("rightQuarter")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="rightQuarter" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("trunkUp")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="trunkUp" />
            </div>
          </div>

          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("trunkDown")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="trunkDown" />
            </div>
          </div>
          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("leftRocker")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="leftRocker" />
            </div>
          </div>
          <div className="grid grid-cols-2 border border-[#f5f5f5]">
            <div className="flex items-center justify-center py-4 text-center text-xs font-semibold md:text-base lg:px-6">
              {tCarParts("rightRocker")}
            </div>
            <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
              <NumericInput fieldName="rightRocker" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 py-4">
          <Button
            type="button"
            size="lg"
            variant={"secondary"}
            onClick={() => {
              router.push(`/settings/matrix?matrix=r-and-i`);
            }}
          >
            {tUI("buttons.cancel")}
          </Button>
          <Button size="lg" type="submit">
            {tUI("buttons.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default RandIMatrixForm;
