"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { createPrivateClient } from "@/api/client/private-create";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import {
  PRIVATE_CLIENT_FORM_DEFAULT_VALUES,
  PRIVATE_CLIENT_SCHEMA,
} from "@/constants/clients";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { PrivateClientData } from "@/types/clients";
import TextInput from "@/components/inputs/TextInput";
import SelectInput from "@/components/inputs/SelectInput";
import useCountries from "@/hooks/useCountries";
import TextareaInput from "@/components/inputs/TextareaInput";
import { updatePrivateClient } from "@/api/client/private-update";
import { onErrorToast } from "@/utils/onErrorToast";
import { deleteClient } from "@/api/client/delete";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const PrivateForm = ({ clientData }: { clientData?: PrivateClientData }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const countries = useCountries();
  const searchParams = useSearchParams();
  const tSettings = useTranslations("Settings.CompanyInfo");
  const t = useTranslations("PageClients");
  const tButton = useTranslations("ui");

  const { id } = useParams();

  const form = useForm({
    values: clientData
      ? {
          name: clientData.name,
          address: clientData.address || "",
          vatRate: clientData.vatRate || 0,
          country: clientData.country || "",
          city: clientData.city || "",
          notes: clientData.notes || "",
        }
      : {
          name: "",
          address: "",
          vatRate: 0,
          country: "",
          city: "",
          notes: "",
        },
    resolver: yupResolver(PRIVATE_CLIENT_SCHEMA),
  });

  const createClient = useMutation({
    mutationFn: async (formData: PrivateClientData) =>
      await createPrivateClient(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.clients],
      });

      toast.success(t("client"), {
        description: t("created"),
      });
      const redirectUrl = searchParams.get("redirectUrl");
      if (redirectUrl) {
        router.push(`${redirectUrl}?clientId=${data.id}`);
      } else {
        router.push(`/clients/${data.id}`);
      }
    },
    onError: () => {
      toast.error(t("client"), {
        description: t("somethingWentWrong"),
      });
    },
  });

  const updateClient = useMutation({
    mutationFn: async (formData: PrivateClientData) => {
      return await updatePrivateClient(formData, id as string);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.clients],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.client, id],
      });

      toast.success(t("client"), {
        description: t("updated"),
      });

      router.push(`/clients?tab=PRIVATE`);
    },
    onError: () => {
      toast.error(t("client"), {
        description: t("somethingWentWrong"),
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async () => {
      await deleteClient(id as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.clients],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.client, id],
      });

      router.replace(`/user/clients?tab=PRIVATE`);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formData) => {
          if (id) {
            updateClient.mutate(formData as PrivateClientData);
          } else {
            createClient.mutate(formData as PrivateClientData);
          }
        })}
        className="w-full"
      >
        <FormInputWrapper>
          <TextInput fieldName="name" fieldLabel={t("name")} />
        </FormInputWrapper>

        <FormInputWrapper>
          <TextInput fieldName="address" fieldLabel={t("address")} />
        </FormInputWrapper>
        <FormInputWrapper>
          <SelectInput
            fieldName="country"
            fieldLabel={t("country")}
            options={countries}
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="city" fieldLabel={t("city")} />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="vatRate" fieldLabel={tSettings("vatRate")} />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextareaInput fieldName="notes" fieldLabel={t("notes")} />
        </FormInputWrapper>

        <div className="flex justify-end gap-2 py-4">
          <Button
            variant={"secondary"}
            size="lg"
            onClick={() => {
              form.reset();
              router.push(`/clients?tab=PRIVATE`);
            }}
          >
            {tButton("buttons.cancel")}
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={createClient.isPending || updateClient.isPending}
          >
            {tButton("buttons.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PrivateForm;
