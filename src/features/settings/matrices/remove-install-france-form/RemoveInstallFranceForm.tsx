"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { FRANCE_REMOVE_INSTALL } from "@/constants/default-matrices";
import TextInput from "@/components/inputs/TextInput";
import { FranceRemoveInstallSchema, franceRemoveInstallSchema } from "./schema";
import {
  createFranceRemoveInstall,
  getFranceRemoveInstall,
  updateFranceRemoveInstall,
} from "@/api/matrices/france-remove-install";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { toast } from "sonner";

export const defaultFormValues = {
  categoryA: (FRANCE_REMOVE_INSTALL.categoryA / 100).toFixed(2),
  categoryB: (FRANCE_REMOVE_INSTALL.categoryB / 100).toFixed(2),
  categoryC: (FRANCE_REMOVE_INSTALL.categoryC / 100).toFixed(2),
  categoryD: (FRANCE_REMOVE_INSTALL.categoryD / 100).toFixed(2),
};
function RemoveInstallFranceForm() {
  const t = useTranslations("Settings.Matrix");
  const tUI = useTranslations("ui");
  const tActions = useTranslations("ToastActions");
  const tNav = useTranslations("Navigation");
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: removeInstallMatrix, isLoading: isLoadingRemoveInstall } =
    useQuery({
      queryKey: [QUERY_KEYS.franceRemoveInstallMatrix],
      queryFn: () => getFranceRemoveInstall(),
    });

  const franceRandI = {
    categoryA: (removeInstallMatrix?.categoryA / 100).toFixed(2),
    categoryB: (removeInstallMatrix?.categoryB / 100).toFixed(2),
    categoryC: (removeInstallMatrix?.categoryC / 100).toFixed(2),
    categoryD: (removeInstallMatrix?.categoryD / 100).toFixed(2),
  };

  const form = useForm<FranceRemoveInstallSchema>({
    values: id && removeInstallMatrix ? franceRandI : defaultFormValues,
    resolver: yupResolver(franceRemoveInstallSchema),
    mode: "onChange",
  });

  const formatDataForSubmit = (data: FranceRemoveInstallSchema) => {
    return {
      categoryA: Math.round(Number(data?.categoryA) * 100),
      categoryB: Math.round(Number(data?.categoryB) * 100),
      categoryC: Math.round(Number(data?.categoryC) * 100),
      categoryD: Math.round(Number(data?.categoryD) * 100),
    };
  };

  const createMatrix = useMutation({
    mutationFn: async (formData: FranceRemoveInstallSchema) => {
      await createFranceRemoveInstall(formatDataForSubmit(formData));
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
    mutationFn: async (formData: FranceRemoveInstallSchema) => {
      await updateFranceRemoveInstall(
        formatDataForSubmit(formData),
        id as string,
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

  if (isLoadingRemoveInstall) return <LoadingScreen />;

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
        <>
          <FormInputWrapper>
            <TextInput fieldName="categoryA" fieldLabel={t("categoryA")} />
          </FormInputWrapper>

          <FormInputWrapper>
            <TextInput fieldName="categoryB" fieldLabel={t("categoryB")} />
          </FormInputWrapper>

          <FormInputWrapper>
            <TextInput fieldName="categoryC" fieldLabel={t("categoryC")} />
          </FormInputWrapper>

          <FormInputWrapper>
            <TextInput fieldName="categoryD" fieldLabel={t("categoryD")} />
          </FormInputWrapper>
        </>
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
export default RemoveInstallFranceForm;
