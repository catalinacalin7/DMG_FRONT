"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import NumericInput from "@/components/inputs/NumericInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import LoadingScreen from "@/components/LoadingScreen";
import NumericFormatInput from "@/components/inputs/NumericFormatInput";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMatrixById } from "@/api/matrices/hail-matrix";
import { updateHailMatrix } from "@/api/matrices/hail-matrix";
import { createHailMatrix } from "@/api/matrices/hail-matrix";
import { UpdateHailMatrix } from "@/types/matrices";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { hailMatrixSchema, HailMatrixSchema } from "./schema";
import { HAIL_DEFAULT } from "@/constants/default-matrices";
import { toast } from "sonner";

const defaultFormValues = {
  name: "",
  rate: 0,
  matrixData: HAIL_DEFAULT.matrixData.map(
    ({ unit, light, medium, strong }) => ({
      unit,
      light: (light / 100).toFixed(2),
      medium: (medium / 100).toFixed(2),
      strong: (strong / 100).toFixed(2),
    }),
  ),
};

function HailMatrixForm() {
  const t = useTranslations("Settings.Matrix");
  const tUnit = useTranslations("PageEstimates");
  const tUI = useTranslations("ui");
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const tActions = useTranslations("ToastActions");
  const tNav = useTranslations("Navigation");

  const { data: hailMatrix, isLoading: isLoadingHailMatrix } = useQuery({
    queryKey: [QUERY_KEYS.hailMatrix],
    queryFn: () => getMatrixById(id as string),
    enabled: !!id,
  });

  const hailMatrixData = hailMatrix?.matrixData.map(
    ({ id, unit, light, medium, strong }) => ({
      id,
      unit,
      light: (light / 100).toFixed(2),
      medium: (medium / 100).toFixed(2),
      strong: (strong / 100).toFixed(2),
    }),
  );

  const hail = {
    name: hailMatrix?.name,
    rate: hailMatrix?.rate,
    matrixData: hailMatrixData,
  };

  const form = useForm<HailMatrixSchema>({
    values: id && hailMatrix ? (hail as any) : defaultFormValues,
    resolver: yupResolver(hailMatrixSchema),
    mode: "onChange",
  });

  const { fields: matrixData } = useFieldArray({
    control: form.control,
    name: "matrixData",
  });

  const createMatrix = useMutation({
    mutationFn: async (formData: HailMatrixSchema) => {
      await createHailMatrix({
        rate: Number(formData.rate),
        matrixData: formData.matrixData.map(
          ({ unit, light, medium, strong }) => ({
            unit,
            light: parseInt((parseFloat(light) * 100).toString()),
            medium: parseInt((parseFloat(medium) * 100).toString()),
            strong: parseInt((parseFloat(strong) * 100).toString()),
          }),
        ),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.createHailMatrix],
      });
      toast.success(tNav("matrix"), {
        description: tActions("created"),
      });
      router.push(`/settings/matrix`);
      form.reset();
    },
    onError: () => {
      toast.error(t("estimate"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const updateMatrix = useMutation({
    mutationFn: async (formData: UpdateHailMatrix) => {
      await updateHailMatrix(
        {
          ...formData,
          rate: Number(formData.rate),
          matrixData: formData.matrixData.map(
            ({ id, unit, light, medium, strong }) => ({
              id,
              unit,
              light: parseInt((light * 100).toString()),
              medium: parseInt((medium * 100).toString()),
              strong: parseInt((strong * 100).toString()),
            }),
          ),
        },
        hailMatrix?.id as string,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.updateHailMatrix],
      });
      toast.success(tNav("matrix"), {
        description: tActions("updated"),
      });
      router.push(`/settings/matrix`);
      form.reset();
    },
    onError: () => {
      toast.error(tNav("matrix"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  if (isLoadingHailMatrix) return <LoadingScreen />;

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData) => {
            if (id) {
              updateMatrix.mutate(formData as any);
            } else {
              createMatrix.mutate(formData as HailMatrixSchema);
            }
          })}
        >
          {/* <div className="py-2 lg:py-6">
            <TextInput
              fieldName="name"
              fieldLabel={t("hailMatrixUniqueName")}
            />
          </div> */}
          <div className="py-2 lg:py-6">
            <NumericFormatInput fieldName="rate" fieldLabel={tUnit("rate")} />
          </div>
          <div className="">
            <div className="grid grid-cols-4 rounded-tl-md rounded-tr-md bg-[#f5f5f5]">
              <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
                {tUnit("unit")}
              </div>
              <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
                {tUnit("lightDamage")} <br />
                (0–20 mm)
              </div>
              <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
                {tUnit("mediumDamage")}
                <br /> (21-31mm)
              </div>
              <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
                {tUnit("strongDamage")}
                <br /> (32-45mm)
              </div>
            </div>
            {matrixData.map((field, index) => {
              return (
                <div
                  key={index}
                  className="grid grid-cols-4 border border-[#f5f5f5]"
                >
                  <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
                    <Label>{field.unit}</Label>
                  </div>
                  <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
                    <NumericInput
                      fieldName={`matrixData.${index}.light`}
                      placeholder="e.g., 1.45"
                    />
                  </div>
                  <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
                    <NumericInput
                      fieldName={`matrixData.${index}.medium`}
                      placeholder="e.g., 1.45"
                    />
                  </div>
                  <div className="flex items-center justify-center py-4 text-center text-xs md:text-base lg:px-6">
                    <NumericInput
                      fieldName={`matrixData.${index}.strong`}
                      placeholder="e.g., 1.45"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 py-4">
            <Button
              type="button"
              size="lg"
              variant={"secondary"}
              onClick={() => {
                router.push(`/settings/matrix?matrix=hail`);
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
    </div>
  );
}
export default HailMatrixForm;
