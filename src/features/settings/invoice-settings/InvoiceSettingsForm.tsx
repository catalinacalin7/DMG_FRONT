"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import TextInput from "@/components/inputs/TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { useRouter } from "@/i18n/navigation";
import {
  createInvoiceNumber,
  getInvoiceNumber,
  InvoiceNumber,
  updateInvoiceNumber,
} from "@/api/invoices/invoices";

const schema = yup.object().shape({
  prefix: yup.string().uppercase().required("Field is required"),
  lastNumber: yup.number().integer("Should be an integer"),
});

interface schemaType extends yup.InferType<typeof schema> {}

const InvoiceSettingsForm = () => {
  const t = useTranslations("Navigation");
  const tActions = useTranslations("ToastActions");
  const tInvoices = useTranslations("PageInvoices");
  const tUI = useTranslations("ui");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["invoice-settings"],
    queryFn: async () => await getInvoiceNumber(),
  });

  const createInvoiceNumberMutation = useMutation({
    mutationFn: async (values: InvoiceNumber) => {
      await createInvoiceNumber(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoice-settings"],
      });
      toast.success(t("invoiceSettings"), {
        description: tActions("created"),
      });
    },
    onError: () => {
      toast.error(t("invoiceSettings"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const updateInvoiceNumberMutation = useMutation({
    mutationFn: async (values: InvoiceNumber) => {
      return await updateInvoiceNumber(
        {
          prefix: values.prefix,
          lastNumber: values.lastNumber,
        },
        data?.id,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoice-settings"],
      });

      toast.success(t("invoiceSettings"), {
        description: tActions("updated"),
      });
    },
    onError: () => {
      toast.error(t("invoiceSettings"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const form = useForm<schemaType>({
    resolver: yupResolver(schema),
    values: data
      ? {
          prefix: data.prefix,
          lastNumber: data.lastNumber,
        }
      : {
          prefix: "",
          lastNumber: 0,
        },
    mode: "all",
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: InvoiceNumber) => {
          if (data?.id) {
            updateInvoiceNumberMutation.mutateAsync(values);
          } else {
            createInvoiceNumberMutation.mutateAsync(values);
          }
        })}
      >
        <FormInputWrapper>
          <TextInput
            fieldName="prefix"
            fieldLabel={tInvoices("prefix")}
            isTextUpperCase={true}
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="lastNumber" fieldLabel={tInvoices("number")} />
        </FormInputWrapper>

        <div className="flex justify-end gap-2 py-4">
          <Button
            type="button"
            size="lg"
            variant={"secondary"}
            onClick={() => {
              router.push(`/dashboard`);
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
};

export default InvoiceSettingsForm;
