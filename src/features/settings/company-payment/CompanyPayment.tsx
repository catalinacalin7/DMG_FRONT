import TextInput from "@/components/inputs/TextInput";
import {
  CompanyData,
  CompanyFormData,
  CompanyPaymentData,
} from "@/types/company";
import * as yup from "yup";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import {
  createCompanyPayment,
  updateCompanyPayment,
} from "@/api/company/company";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useTranslations } from "next-intl";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { toast } from "sonner";
import { useEffect } from "react";

const companyPaymentSchema = yup.object().shape({
  iban: yup.string().required(),
  bic: yup.string().required(),
  bankName: yup.string().required(),
});

const defaultFormValues = {
  iban: "",
  bic: "",
  bankName: "",
};

type CompanyPaymentFormProps = {
  companyPaymentData?: CompanyPaymentData | undefined;
  onClose?: () => void;
};
type CompanyPaymentSchemaType = yup.InferType<typeof companyPaymentSchema>;

function CompanyPaymentForm({
  companyPaymentData,
  onClose,
}: CompanyPaymentFormProps) {
  const t = useTranslations("Settings.CompanyPayment");
  const tActions = useTranslations("ToastActions");
  const tUI = useTranslations("ui");
  const queryClient = useQueryClient();

  // companyPaymentData ??
  const form = useForm<CompanyPaymentSchemaType>({
    defaultValues: companyPaymentData ?? defaultFormValues,
    resolver: yupResolver(companyPaymentSchema),
  });

  const createCompanyPaymentMutation = useMutation({
    mutationFn: async (formData: typeof defaultFormValues) => {
      await createCompanyPayment(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.companyPayment],
      });

      toast.success(t("companyPayment"), {
        description: tActions("created"),
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast.error(t("companyPayment"), {
        description: tActions("somethingWentWrong"),
      });
      onClose();
      form.reset();
    },
  });

  const updateCompanyPaymentMutation = useMutation({
    mutationFn: async (values: typeof defaultFormValues) => {
      console.log(values);
      await updateCompanyPayment(companyPaymentData.id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.companyPayment],
      });
      toast.success(t("companyPayment"), {
        description: tActions("updated"),
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast.error(t("companyPayment"), {
        description: tActions("somethingWentWrong"),
      });
      onClose();
      form.reset();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formData) => {
          if (!!companyPaymentData.id) {
            updateCompanyPaymentMutation.mutate(formData as CompanyPaymentData);
          } else {
            createCompanyPaymentMutation.mutate(formData as CompanyPaymentData);
          }
        })}
        className="w-full"
      >
        <FormInputWrapper>
          <TextInput fieldName="iban" fieldLabel={t("iban")} isDialogForm />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="bic" fieldLabel={t("bic")} isDialogForm />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput
            fieldName="bankName"
            fieldLabel={t("bankName")}
            isDialogForm
          />
        </FormInputWrapper>

        <div className="flex justify-end gap-2 py-4">
          <Button
            size="lg"
            type="submit"
            disabled={
              createCompanyPaymentMutation.isPending ||
              updateCompanyPaymentMutation.isPending
            }
          >
            {tUI("buttons.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default CompanyPaymentForm;
