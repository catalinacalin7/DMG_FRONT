import TextInput from "@/components/inputs/TextInput";
import {
  CompanyData,
  CompanyFormData,
  CompanyPaymentData,
  DeleteAccountData,
} from "@/types/company";
import * as yup from "yup";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import {
  createCompanyPayment,
  deleteAccount,
  updateCompanyPayment,
} from "@/api/company/company";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useTranslations } from "next-intl";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { toast } from "sonner";
import { useEffect } from "react";
import { postAuthLogin } from "@/api/auth/login";
import { postAuthLogout } from "@/api/auth/logout";
import { useRouter } from "@/i18n/navigation";
const deleteAccountSchema = yup.object().shape({
  password: yup.string().required(),
});

const defaultFormValues = {
  password: "",
};

type DeleteAccountFormProps = {
  onClose?: () => void;
};
type DeleteAccountSchemaType = yup.InferType<typeof deleteAccountSchema>;

function DeleteAccountForm({ onClose }: DeleteAccountFormProps) {
  const t = useTranslations("Settings.CompanyPayment");
  const tActions = useTranslations("ToastActions");
  const tAuth = useTranslations("Auth");
  const tUI = useTranslations("ui");
  const tNav = useTranslations("Navigation");
  const queryClient = useQueryClient();
  const router = useRouter();
  // companyPaymentData ??
  const form = useForm<DeleteAccountSchemaType>({
    defaultValues: defaultFormValues,
    resolver: yupResolver(deleteAccountSchema),
  });
  const deleteAccountMutation = useMutation({
    mutationFn: async (data: DeleteAccountData) => {
      await deleteAccount(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.companyInfo],
      });

      toast.success(tNav("deleteAccount"), {
        description: tActions("deleted"),
      });
      form.reset();
      onClose();
      router.push(`/delete-account-success`);
    },
    onError: () => {
      toast.error(tNav("deleteAccount"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const handleDelete = (data: DeleteAccountData) => {
    deleteAccountMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleDelete)} className="w-full">
        <FormInputWrapper>
          <TextInput
            fieldName="password"
            fieldLabel={tAuth("enterPassword")}
            type="password"
            isDialogForm
          />
        </FormInputWrapper>

        <div className="flex justify-end gap-2 py-4">
          <Button
            variant={"secondary"}
            size="lg"
            onClick={() => {
              form.reset();
              onClose();
            }}
          >
            {tUI("buttons.cancel")}
          </Button>
          <Button size="lg" type="submit" variant="destructive">
            {tUI("buttons.delete")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default DeleteAccountForm;
