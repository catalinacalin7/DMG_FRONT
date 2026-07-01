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
import {
  createPaymentInfo,
  getPaymentInfo,
  PayementInfoCreate,
  updatePaymentInfo,
} from "@/api/client/payment-info/payment-info";
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { useRouter } from "@/i18n/navigation";

const schema = yup.object().shape({
  accountName: yup.string().required("Field is required"),
  IBAN: yup.string().required("Field is required"),
  BIC: yup.string().required("Field is required"),
  bankName: yup.string().required("Field is required"),
});

interface schemaType extends yup.InferType<typeof schema> {}

const PaymentInfoForm = () => {
  const t = useTranslations("PageClients");
  const tAuth = useTranslations("Auth");
  const tUI = useTranslations("ui");
  const router = useRouter();
  const { id: clientId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingPaymentInfo } = useQuery({
    queryKey: ["payment-info"],
    queryFn: async () => await getPaymentInfo(clientId as string),
    enabled: !!clientId,
  });

  const createPaymentInfoMutation = useMutation({
    mutationFn: async ({
      values,
      clientId,
    }: {
      values: PayementInfoCreate;
      clientId: string;
    }) => {
      await createPaymentInfo(values, clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-info"],
      });
      toast.success(t("paymentInfo"), {
        description: t("created"),
      });
    },
    onError: () => {
      toast.error(t("paymentInfo"), {
        description: t("somethingWentWrong"),
      });
    },
  });

  const updateClientPayment = useMutation({
    mutationFn: async (values: PayementInfoCreate) => {
      return await updatePaymentInfo(
        {
          accountName: values.accountName,
          bankName: values.bankName,
          BIC: values.BIC,
          IBAN: values.IBAN,
        },
        clientId as string,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-info"],
      });

      toast.success(t("paymentInfo"), {
        description: t("updated"),
      });
    },
    onError: () => {
      toast.error(t("paymentInfo"), {
        description: tAuth("somethingWentWrong"),
      });
    },
  });

  const form = useForm<schemaType>({
    resolver: yupResolver(schema),
    values: data ?? {
      accountName: "",
      IBAN: "",
      BIC: "",
      bankName: "",
    },
    mode: "all",
  });

  if (isLoadingPaymentInfo) {
    return <LoadingScreen />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: PayementInfoCreate) => {
          if (clientId && !data?.id) {
            createPaymentInfoMutation.mutateAsync({
              values,
              clientId: clientId as string,
            });
          }
          if (data?.id && clientId) {
            updateClientPayment.mutateAsync(values);
          }
        })}
      >
        <FormInputWrapper>
          <TextInput
            fieldName="accountName"
            fieldLabel={t("nameAssociatedWithTheAccount")}
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="IBAN" fieldLabel="IBAN" />
        </FormInputWrapper>

        <FormInputWrapper>
          <TextInput fieldName="BIC" fieldLabel="BIC" />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="bankName" fieldLabel={t("bankName")} />
        </FormInputWrapper>

        <div className="flex justify-end gap-2 py-4">
          <Button
            type="button"
            size="lg"
            variant={"secondary"}
            onClick={() => {
              router.push(`/clients`);
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

export default PaymentInfoForm;
