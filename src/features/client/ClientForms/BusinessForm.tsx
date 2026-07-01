"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { createBusinessClient } from "@/api/client/business-create";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  BUSINESS_CLIENT_SCHEMA,
  BUSINESS_CLIENT_FORM_DEFAULT_VALUES,
} from "@/constants/clients";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { BusinessClientData } from "@/types/clients";
import TextInput from "@/components/inputs/TextInput";
import TextareaInput from "@/components/inputs/TextareaInput";
import SelectInput from "@/components/inputs/SelectInput";
import useCountries from "@/hooks/useCountries";
import { updateBusinessClient } from "@/api/client/business-update";
import { deleteClient } from "@/api/client/delete";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import * as yup from "yup";

const BusinessForm = ({ clientData }: { clientData?: BusinessClientData }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const countries = useCountries();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const tInvoices = useTranslations("PageInvoices");
  const t = useTranslations("PageClients");
  const tAuth = useTranslations("Auth");
  const tSettings = useTranslations("Settings.CompanyInfo");
  const tButton = useTranslations("ui");

  const form = useForm<yup.InferType<typeof BUSINESS_CLIENT_SCHEMA>>({
    values: clientData
      ? {
          name: clientData.name,
          address: clientData.address || "",
          tradeRegister: clientData.tradeRegister,
          country: clientData.country,
          city: clientData.city,
          zipCode: clientData.zipCode || "",
          taxID: clientData.taxID || "",
          vatID: clientData.vatID || "",
          vatRate: clientData.vatRate || 0,
          clientDiscount: clientData.clientDiscount || 0,
          notes: clientData.notes || "",
        }
      : {
          name: "",
          address: "",
          tradeRegister: "",
          country: "",
          city: "",
          zipCode: "",
          taxID: "",
          vatID: "",
          vatRate: 0,
          clientDiscount: 0,
          notes: "",
        },
    resolver: yupResolver(BUSINESS_CLIENT_SCHEMA),
  });

  const createClient = useMutation({
    mutationFn: async (formData: BusinessClientData) =>
      await createBusinessClient(formData),
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
    mutationFn: async (formData: BusinessClientData) => {
      await updateBusinessClient(formData, id as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.clients],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.client, id],
      });
      toast.success(t("client"), {
        description: t("updated"),
      });
      router.push(`/clients?tab=BUSINESS`);
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

      router.replace(`/clients`);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formData) => {
          if (id) {
            return updateClient.mutate(formData as BusinessClientData);
          } else {
            return createClient.mutate(formData as BusinessClientData);
          }
        })}
        className="w-full"
      >
        <FormInputWrapper>
          <TextInput fieldName="name" fieldLabel={t("companyName")} />
        </FormInputWrapper>

        <FormInputWrapper>
          <TextInput
            fieldName="tradeRegister"
            fieldLabel={tInvoices("regNo")}
          />
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
          <TextInput fieldName="zipCode" fieldLabel={t("zipCode")} />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="taxID" fieldLabel={t("taxID")} />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="vatID" fieldLabel={t("vatId")} />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="vatRate" fieldLabel={tSettings("vatRate")} />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="clientDiscount" fieldLabel={t("discount")} />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextareaInput fieldName="notes" fieldLabel={t("notes")} />
        </FormInputWrapper>

        <div className="flex justify-end gap-2 py-4">
          <Button
            type="button"
            size="lg"
            variant={"secondary"}
            onClick={() => {
              form.reset();
              router.push(`/clients?tab=BUSINESS`);
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

export default BusinessForm;
