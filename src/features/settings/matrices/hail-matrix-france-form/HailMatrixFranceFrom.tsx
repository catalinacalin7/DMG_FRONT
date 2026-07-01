"use client";

import NumericInput from "@/components/inputs/NumericInput";
import TextInput from "@/components/inputs/TextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "@/components/LoadingScreen";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  defaultFranceHailValues,
  franceHailSchema,
  FranceHailTypeSchema,
} from "./schema";
import { createFranceHailMatrix } from "@/api/matrices/france-hail-matrix";
import { getFranceMatrix } from "@/api/matrices/france-hail-matrix";
import { updateFranceHailMatrix } from "@/api/matrices/france-hail-matrix";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function HailMatrixFranceForm() {
  const { id } = useParams();
  const t = useTranslations("Settings.Matrix");
  const tUnit = useTranslations("PageEstimates");
  const tUI = useTranslations("ui");
  const router = useRouter();
  const queryClient = useQueryClient();
  const tActions = useTranslations("ToastActions");
  const tNav = useTranslations("Navigation");

  const { data: hailMatrix, isLoading: isLoadingHailMatrix } = useQuery({
    queryKey: [QUERY_KEYS.franceHail],
    queryFn: () => getFranceMatrix(),
  });

  const hailMatrixData = hailMatrix?.franceHailData?.map(
    ({ min, max, unitsTime }) => ({
      min,
      max,
      unitsTime: (Number(unitsTime) / 100).toFixed(2),
    }),
  );

  const franceHail = hailMatrix
    ? {
        rate: (Number(hailMatrix?.rate) / 100).toFixed(2),
        light: (Number(hailMatrix?.light) / 100).toFixed(2),
        medium: (Number(hailMatrix?.medium) / 100).toFixed(2),
        strong: (Number(hailMatrix?.strong) / 100).toFixed(2),
        aluminium: (Number(hailMatrix?.aluminium) / 100).toFixed(2),
        technicalDents: (Number(hailMatrix?.technicalDents) / 100).toFixed(2),
        repairAndPaint: (Number(hailMatrix?.repairAndPaint) / 100).toFixed(2),
        cowl: (Number(hailMatrix?.cowl) / 100).toFixed(2),
        door: (Number(hailMatrix?.door) / 100).toFixed(2),
        fender: (Number(hailMatrix?.fender) / 100).toFixed(2),
        quarter: (Number(hailMatrix?.quarter) / 100).toFixed(2),
        hood: (Number(hailMatrix?.hood) / 100).toFixed(2),
        windScreenFrame: (Number(hailMatrix?.windScreenFrame) / 100).toFixed(2),
        roof: (Number(hailMatrix?.roof) / 100).toFixed(2),
        rail: (Number(hailMatrix?.rail) / 100).toFixed(2),
        trunk: (Number(hailMatrix?.trunk) / 100).toFixed(2),
        rocker: (Number(hailMatrix?.rocker) / 100).toFixed(2),
        franceHailData: hailMatrixData,
      }
    : {};

  const form = useForm<FranceHailTypeSchema>({
    values: id && hailMatrix ? franceHail : defaultFranceHailValues,
    resolver: yupResolver(franceHailSchema),
    mode: "onChange",
  });

  const { fields: franceHailData } = useFieldArray({
    control: form.control,
    name: "franceHailData",
  });

  const formatDataForSubmit = (data: FranceHailTypeSchema) => {
    return {
      rate: Math.round(Number(data?.rate) * 100),
      light: Math.round(Number(data?.light) * 100),
      medium: Math.round(Number(data?.medium) * 100),
      strong: Math.round(Number(data?.strong) * 100),
      aluminium: Math.round(Number(data?.aluminium) * 100),
      technicalDents: Math.round(Number(data?.technicalDents) * 100),
      repairAndPaint: Math.round(Number(data?.repairAndPaint) * 100),
      cowl: Math.round(Number(data?.cowl) * 100),
      door: Math.round(Number(data?.door) * 100),
      fender: Math.round(Number(data?.fender) * 100),
      quarter: Math.round(Number(data?.quarter) * 100),
      hood: Math.round(Number(data?.hood) * 100),
      windScreenFrame: Math.round(Number(data?.windScreenFrame) * 100),
      roof: Math.round(Number(data?.roof) * 100),
      rail: Math.round(Number(data?.rail) * 100),
      trunk: Math.round(Number(data?.trunk) * 100),
      rocker: Math.round(Number(data?.rocker) * 100),
      franceHailData: data?.franceHailData?.map(({ min, max, unitsTime }) => ({
        min,
        max,
        unitsTime: Number(unitsTime) * 100,
      })),
    };
  };

  const createMatrix = useMutation({
    mutationFn: async (formData: FranceHailTypeSchema) => {
      await createFranceHailMatrix(formatDataForSubmit(formData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.franceHail],
      });
      toast.success(tNav("matrix"), {
        description: tActions("created"),
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

  const updateMatrix = useMutation({
    mutationFn: async (formData: FranceHailTypeSchema) => {
      await updateFranceHailMatrix(formatDataForSubmit(formData));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.franceHail],
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
              updateMatrix.mutate(formData as FranceHailTypeSchema);
            } else {
              createMatrix.mutate(formData as FranceHailTypeSchema);
            }
          })}
        >
          <div className="py-2 lg:py-6">
            <TextInput fieldName="rate" fieldLabel={t("rate")} />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput fieldName="light" fieldLabel={t("diameterLight")} />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput fieldName="medium" fieldLabel={t("diameterMedium")} />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput fieldName="strong" fieldLabel={t("diameterStrong")} />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput fieldName="aluminium" fieldLabel={t("aluminium")} />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput
              fieldName="technicalDents"
              fieldLabel={t("technicalDents")}
            />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput
              fieldName="repairAndPaint"
              fieldLabel={t("repairAndPaint")}
            />
          </div>

          <div className="py-2 lg:py-6">
            <TextInput fieldName="cowl" fieldLabel={tUnit("cowl")} />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput fieldName="door" fieldLabel={tUnit("door")} />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput fieldName="fender" fieldLabel={tUnit("fender")} />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput fieldName="quarter" fieldLabel={tUnit("quarter")} />
          </div>

          <div className="py-2 lg:py-6">
            <TextInput
              fieldName="windScreenFrame"
              fieldLabel={tUnit("windScreenFrame")}
            />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput fieldName="rail" fieldLabel={tUnit("rail")} />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput fieldName="trunk" fieldLabel={tUnit("trunk")} />
          </div>
          <div className="py-2 lg:py-6">
            <TextInput fieldName="rocker" fieldLabel={tUnit("rocker")} />
          </div>
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full py-2 lg:py-6">
              <div className="grid grid-cols-2 rounded-tl-md rounded-tr-md bg-[#f5f5f5]">
                <div className="flex items-center justify-center py-4 text-center text-xs md:text-base">
                  {tUnit("dentCount")}
                </div>
                <div className="flex items-center justify-center py-4 text-center text-xs md:text-base">
                  {tUnit("coefficient")}
                </div>
              </div>

              {franceHailData.map((field, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-2 border border-[#f5f5f5]"
                  >
                    <div className="flex items-center justify-center py-4 text-center text-xs md:text-base">
                      <Label>
                        {field?.max <= 10
                          ? `${field.max}`
                          : `${field.min}-${field.max}`}
                      </Label>
                    </div>
                    <div className="flex items-center justify-center py-4 text-center text-xs md:text-base">
                      <NumericInput
                        fieldName={`franceHailData.${index}.unitsTime`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
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
export default HailMatrixFranceForm;
