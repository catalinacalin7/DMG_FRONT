import TextInput from "@/components/inputs/TextInput";
import { CompanyData, CompanyFormData } from "@/types/company";
import * as yup from "yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { createCompany, updateCompany } from "@/api/company/company";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import CountriesSelect from "@/components/selectors/CountriesSelect";
import { useTranslations } from "next-intl";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCY_CODE, CURRENCY_CODE_ESTIMATE } from "../constants/constants";
import { toast } from "sonner";
import { toDecimal, toInteger } from "@/utils/numberUtils";

const companyInfoSchema = yup.object().shape({
  name: yup.string().required(),
  website: yup.string().optional(),
  tradeRegister: yup.string().optional(),
  email: yup.string().email("Email should be unique").required(),
  phone: yup.string().required(),
  taxIdentificationNumber: yup.string().required(),
  taxVAT: yup.string().required(),
  shareCapital: yup
    .string()
    .matches(/^[0-9]\d*\.\d{2}$/, "Must be grater than 0 plus two decimals.")
    .required("This field is required.")
    .transform((value) => {
      return value.replace(",", ".");
    }),
  vatRate: yup
    .number()
    .integer("Number 1 to 100")
    .min(0, "Min 0")
    .max(100, "Max 100")
    .required("Number from 1-100"),
  currencyCode: yup.string().required(),
  country: yup.string().required(),
  address: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  zipCode: yup.string().optional(),
});

type CompanyInfoType = yup.InferType<typeof companyInfoSchema>;

function CompanyInfoForm({ companyData }: { companyData: CompanyData }) {
  const t = useTranslations("Settings.CompanyInfo");
  const tCompanyInfo = useTranslations("PageClients");
  const tInvoices = useTranslations("PageInvoices");
  const tAuth = useTranslations("Auth");
  const tUI = useTranslations("ui");
  const tActions = useTranslations("ToastActions");
  const queryClient = useQueryClient();

  const form = useForm<CompanyInfoType>({
    values: companyData
      ? {
          name: companyData.name,
          website: companyData.website,
          tradeRegister: companyData.tradeRegister,
          email: companyData.email,
          phone: companyData.phone,
          taxIdentificationNumber: companyData.taxIdentificationNumber,
          taxVAT: companyData.taxVAT,
          shareCapital: String(toDecimal(companyData.shareCapital)),
          vatRate: companyData.vatRate,
          currencyCode: companyData.currencyCode,
          country: companyData.country,
          address: companyData.address,
          city: companyData.city,
          state: companyData.state,
          zipCode: companyData.zipCode,
        }
      : {
          name: "",
          website: "",
          email: "",
          phone: "",
          taxIdentificationNumber: "",
          taxVAT: "",
          shareCapital: "",
          vatRate: 0,
          currencyCode: "",
          country: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
        },
    resolver: yupResolver(companyInfoSchema),
  });

  const submitFormMutation = useMutation({
    mutationFn: async (formData: CompanyFormData) => {
      if (!companyData) {
        await createCompany({
          ...formData,
          shareCapital: toInteger(String(formData.shareCapital)),
        });
      } else {
        await updateCompany({
          ...formData,
          shareCapital: toInteger(String(formData.shareCapital)),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.companyInfo],
      });

      toast.success(t("companyInfo"), {
        description: tActions("updated"),
      });
    },
    onError: () => {
      toast.error(t("companyInfo"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formData) =>
          submitFormMutation.mutate(formData as any),
        )}
      >
        <FormInputWrapper>
          <TextInput
            fieldName="name"
            fieldLabel={tCompanyInfo("companyName")}
            required
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput
            fieldName="email"
            fieldLabel={tAuth("email")}
            type="email"
            required
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="website" fieldLabel={t("website")} />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="phone" fieldLabel={tAuth("phone")} required />
        </FormInputWrapper>

        <FormInputWrapper>
          <TextInput
            fieldName="tradeRegister"
            fieldLabel={tInvoices("regNo")}
            required
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput
            fieldName="taxIdentificationNumber"
            fieldLabel={t("taxIdentificationNumber")}
            required
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="taxVAT" fieldLabel={t("taxVAT")} required />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput
            fieldName="shareCapital"
            fieldLabel={t("shareCapital")}
            required
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="vatRate" fieldLabel={t("vatRate")} required />
        </FormInputWrapper>
        <FormInputWrapper>
          <Controller
            control={form.control}
            name="currencyCode"
            render={({ field }) => (
              <FormField
                control={form.control}
                name="currencyCode"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 place-items-start justify-items-start lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
                    <FormLabel className="text-nowrap text-[16px] font-semibold lg:pr-14">
                      {t("currencyCode")}
                      {"*"}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectCurrency")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCY_CODE_ESTIMATE.map((code) => (
                          <SelectItem key={code.label} value={code.value}>
                            {code.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <CountriesSelect required />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput
            fieldName="address"
            fieldLabel={tCompanyInfo("address")}
            required
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput
            fieldName="city"
            fieldLabel={tCompanyInfo("city")}
            required
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="state" fieldLabel={tCompanyInfo("state")} />
        </FormInputWrapper>
        <FormInputWrapper>
          <TextInput fieldName="zipCode" fieldLabel={tCompanyInfo("zipCode")} />
        </FormInputWrapper>
        <div className="flex justify-end gap-2 py-4">
          <Button
            variant={"secondary"}
            size="lg"
            onClick={() => {
              form.reset();
            }}
          >
            {tUI("buttons.cancel")}
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={submitFormMutation.isPending}
          >
            {tUI("buttons.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default CompanyInfoForm;
