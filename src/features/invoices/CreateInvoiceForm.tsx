"use client";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInvoice,
  InvoiceResponse,
  issueInvoice,
  updateInvoice,
  updateInvoiceIssue,
} from "@/api/invoices/invoices";
import {
  CURRENCY_CODE,
  CURRENCY_CODE_ESTIMATE,
} from "../settings/constants/constants";
import { getAllClients } from "@/api/client/get-all";
import {
  getEstimatesFor,
  getHailEstimateById,
  getHailEstimates,
} from "@/api/estimates/estimates";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { Button } from "@/components/ui/button";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { toast } from "@/components/ui/use-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckboxInput from "@/components/inputs/CheckboxInput";
import { toDecimal, toInteger } from "@/utils/numberUtils";
import { BusinessClientData, PrivateClientData } from "@/types/clients";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import SelectLabelTop from "@/components/inputs/SelectLabelTop";
import EstimateServiceForm from "./EstimateServiceForm";
import { estimateServiceSchema } from "./EstimateServiceForm";
import Form from "@/components/inputs/Form";
import { add, differenceInDays } from "date-fns";
import { Trash2 } from "lucide-react";
import { CompanyFormData } from "@/types/company";
import TextareaInput from "@/components/inputs/TextareaInput";
import { calculatePercentage } from "@/utils/calculatePercentage";
import DefaultTextInput from "@/components/inputs/DefaultTextInput";
import { getClientById } from "@/api/client/get-by-id";
import { InvoiceStatus } from "@/types/invoices";

const schema = yup.object().shape({
  series: yup.string(),
  number: yup.string(),
  clientId: yup.string().required("Field is requried"),
  issueDate: yup.string().datetime().required("Field is required"),
  dueDate: yup.string().required("Field is required"),
  sentDate: yup.string().datetime().required("Field is required"),
  amountDue: yup.number().required("Field is required"),
  total: yup.number().typeError("Field is requried"),
  currency: yup
    .string()
    .typeError("Field is requried")
    .required("Field is required"),
  vat: yup.string(),
  isDiscount: yup.boolean(),
  vatPercentage: yup
    .string()
    .typeError("Field is required")
    .required("Field is required"),
  discount: yup
    .number()
    .integer("Number 1 to 100")
    .min(0, "Min 0")
    .max(100, "Max 100")
    .required("Number from 1-100"),
  notes: yup.string().optional(),
  status: yup
    .mixed()
    .oneOf(["SENT", "ISSUED", "DRAFT"], "Field is requried")
    .default("DRAFT"),
  estimateService: yup.array().of(estimateServiceSchema),
});

type CreateInvoiceFormProps = {
  invoice?: InvoiceResponse;
  clients?: (BusinessClientData | PrivateClientData)[];
  id?: string;
  companyData?: CompanyFormData;
};

export type EstimateService = yup.InferType<typeof estimateServiceSchema>;

const CreateInvoiceForm = ({
  invoice,
  id,
  companyData,
}: CreateInvoiceFormProps) => {
  const t = useTranslations("PageInvoices");
  const tUI = useTranslations("ui");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => getAllClients({}),
  });

  const differenceDueDate = differenceInDays(
    new Date(invoice?.dueDate),
    new Date(invoice?.issueDate),
  );

  const form = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    values:
      id && invoice
        ? {
            clientId: invoice.clientId,
            series: invoice.series,
            number: invoice.number,
            status: invoice.status,
            issueDate: String(invoice.issueDate),
            sentDate: String(invoice.sentDate),
            dueDate: String(differenceDueDate),
            vatPercentage: String(invoice.vatPercentage),
            amountDue: invoice.amountDue,
            total: invoice.total,
            currency: invoice.currency,
            isDiscount: invoice.isDiscount,
            discount: invoice.discount,
            notes: invoice.notes,
            estimateService: invoice.estimateService,
          }
        : {
            series: "",
            number: "",
            issueDate: null,
            sentDate: "",
            dueDate: "",
            vatPercentage: "",
            amountDue: 0,
            total: 0,
            currency: companyData?.currencyCode,
            isDiscount: false,
            status: "DRAFT",
            discount: 0,
            notes: "",
            estimateService: [],
          },
  });

  const {
    clientId,
    discount,
    isDiscount,
    vatPercentage,
    sentDate,
    issueDate,
    dueDate,
    estimateService: serviceEstimates,
    total,
    amountDue,
    vat,
    status,
  } = useWatch({
    control: form.control,
  });

  const { data: clientData, isLoading: isLoadingClientData } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId as string),
    enabled: !!clientId,
  });

  useEffect(() => {
    if (clientId && !invoice?.isDiscount) {
      form.setValue("discount", clientData?.clientDiscount);
    }
  }, [clientId, clientData?.clientDiscount, form]);

  const {
    fields: estimateService,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "estimateService",
  });

  const { data: estimates } = useQuery({
    queryKey: [QUERY_KEYS.getHailEstimates, clientId],
    queryFn: () =>
      getEstimatesFor({
        searchQuery: "",
        clientId: clientId as string,
      }),
    enabled: Boolean(clientId),
  });

  function convertToISODate(date, addDays) {
    const dueDate = add(new Date(date), { days: addDays });
    const isoDate = new Date(dueDate).toISOString();
    return isoDate;
  }

  const calculateTotal = serviceEstimates?.reduce(
    (acc: number, item: EstimateService) => {
      let total = 0;
      total += item.price;
      return acc + total;
    },
    0,
  );

  const calculateTotalDiscount = serviceEstimates?.reduce(
    (acc: number, item: EstimateService) => {
      let total = 0;
      total += item.price;
      total = (total * discount) / 100 / 100;
      return acc + total;
    },
    0,
  );

  const calculateTotalVat = serviceEstimates?.reduce(
    (acc: number, item: EstimateService) => {
      let total = 0;
      total += item.price;
      if (isDiscount) {
        total = total - (total * discount) / 100;
      }
      total = (total * +vatPercentage) / 100 / 100;
      return acc + total;
    },
    0,
  );

  const calculateAmountDue = serviceEstimates?.reduce(
    (acc: number, item: EstimateService) => {
      let total = 0;
      total += item.price;
      if (isDiscount) {
        total = total - (total * discount) / 100;
      }
      total = total + (total * +vatPercentage) / 100;
      return acc + total;
    },
    0,
  );

  useEffect(() => {
    form.setValue("amountDue", calculateAmountDue);
  }, [calculateAmountDue, form]);

  useEffect(() => {
    form.setValue("total", calculateTotal - calculateTotalDiscount);
  }, [calculateTotal, calculateTotalDiscount, form]);

  const onAdd = (item: EstimateService) => {
    append(item);
  };
  const onRemove = (index: number) => {
    remove(index);
  };

  const createInvoiceMutation = useMutation({
    mutationFn: async (formData: any) => {
      const data = {
        status: formData.status,
        clientId: formData.clientId,
        issueDate: formData.issueDate,
        sentDate: formData.sentDate,
        dueDate: convertToISODate(formData.issueDate, formData.dueDate),
        amountDue: formData.amountDue,
        total: Number(formData.total),
        currency: formData.currency,
        vatPercentage: +formData.vatPercentage,
        notes: formData.notes,
        isDiscount: formData.isDiscount,
        discount: Number(formData?.discount) || 0,
        estimateService: formData.estimateService,
      };
      // @ts-ignore
      await createInvoice(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      toast({
        title: "Invoie",
        description: t("newInvoiceHasBeenCreated"),
      });
      router.push(`/invoices`);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Invoice",
        description: t("thereWasAProblemWithYourRequest"),
        variant: "destructive",
      });
    },
  });

  const issueInvoiceMutation = useMutation({
    mutationFn: async (formData: any) => {
      const data = {
        clientId: formData.clientId,
        issueDate: formData.issueDate,
        sentDate: formData.sentDate,
        dueDate: convertToISODate(formData.issueDate, formData.dueDate),
        amountDue: +formData.amountDue,
        total: Number(formData.total),
        currency: formData.currency,
        vatPercentage: +formData.vatPercentage,
        notes: formData.notes,
        isDiscount: formData.isDiscount,
        discount: Number(formData?.discount) || 0,
        estimateService: formData.estimateService,
      };
      // @ts-ignore
      await issueInvoice(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      toast({
        title: "Invoie",
        description: t("newInvoiceHasBeenCreated"),
      });
      router.push(`/invoices`);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Invoice",
        description: t("thereWasAProblemWithYourRequest"),
        variant: "destructive",
      });
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: async (formData: any) => {
      await updateInvoice(id as string, {
        status: formData.status,
        clientId: formData.clientId,
        issueDate: formData.issueDate,
        sentDate: formData.sentDate,
        // @ts-ignore
        dueDate: convertToISODate(formData.issueDate, formData.dueDate),
        amountDue: +formData.amountDue,
        total: Number(formData.total),
        currency: formData.currency,
        vatPercentage: +formData.vatPercentage,
        isDiscount: formData.isDiscount,
        discount: Number(formData?.discount) || 0,
        notes: formData.notes,
        estimateService: formData.estimateService,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      toast({
        title: "Invoie",
        description: t("newInvoiceHasBeenCreated"),
      });
      router.push(`/invoices`);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Invoice",
        description: t("thereWasAProblemWithYourRequest"),
        variant: "destructive",
      });
    },
  });
  const updateInvoiceIssueMutation = useMutation({
    mutationFn: async (formData: any) => {
      await updateInvoiceIssue(id as string, {
        clientId: formData.clientId,
        issueDate: formData.issueDate,
        sentDate: formData.sentDate,
        // @ts-ignore
        dueDate: convertToISODate(formData.issueDate, formData.dueDate),
        amountDue: +formData.amountDue,
        total: Number(formData.total),
        currency: formData.currency,
        vatPercentage: +formData.vatPercentage,
        isDiscount: formData.isDiscount,
        discount: Number(formData?.discount) || 0,
        notes: formData.notes,
        estimateService: formData.estimateService,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      toast({
        title: "Invoie",
        description: t("newInvoiceHasBeenCreated"),
      });
      router.push(`/invoices`);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Invoice",
        description: t("thereWasAProblemWithYourRequest"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: yup.InferType<typeof schema>) => {
    if (id) {
      updateInvoiceMutation.mutate(values);
    } else {
      createInvoiceMutation.mutate(values);
    }
  };

  return (
    <div>
      <h3 className="hidden text-3xl font-bold lg:block">
        {t("createInvoice")}
      </h3>
      <Form id="invoiceForm" form={form}>
        <div className="grid grid-cols-1 items-start justify-between gap-2 py-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-2 xl:grid-cols-6">
          <SelectLabelTop
            fieldName="clientId"
            fieldLabel={t("client")}
            options={
              clients?.map((client) => {
                return {
                  label: client.name,
                  value: client.id as string,
                };
              }) || []
            }
            disabled={Boolean(id)}
          />
          <DatePickerInput
            fieldName="issueDate"
            fieldLabel={t("issueDate")}
            labelPosition="top"
          />

          <DatePickerInput
            fieldName="sentDate"
            fieldLabel={t("sentDate")}
            labelPosition="top"
          />

          <SelectLabelTop
            fieldName="dueDate"
            fieldLabel={t("dueDate")}
            options={[
              {
                label: "0 Days",
                value: "0",
              },
              {
                label: "15 Days",
                value: "15",
              },
              {
                label: "30 Days",
                value: "30",
              },
              {
                label: "45 Days",
                value: "45",
              },
            ]}
          />
          <SelectLabelTop
            fieldName="currency"
            fieldLabel={t("currency")}
            options={CURRENCY_CODE_ESTIMATE}
          />
          <SelectLabelTop
            fieldName="vatPercentage"
            fieldLabel={t("VAT")}
            options={[
              {
                label: "0",
                value: "0",
              },
              {
                label: "19",
                value: "19",
              },
              {
                label: "20",
                value: "20",
              },
              {
                label: "21",
                value: "21",
              },
            ]}
          />
        </div>
      </Form>
      <div className="flex w-full flex-col gap-2 py-2">
        {estimateService.map((service, index) => {
          const serviceDescription = service.description.split("\n");

          return (
            <div
              key={service.id}
              className="grid w-full grid-cols-1 gap-4 border bg-gray-100 p-4 lg:grid-cols-5"
            >
              <div>
                <p className="text-sm">Service</p>
                <h1 className="text-base font-medium">{service.serviceName}</h1>
              </div>
              <div>
                <p className="text-sm">Description</p>
                <h2 className="text-wrap text-base font-medium">
                  {serviceDescription.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </h2>
              </div>
              <div>
                <p className="text-sm">Price</p>
                <h2 className="text-base font-medium">
                  {toDecimal(service.price)}
                </h2>
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    remove(index);
                    form.setValue("total", 0);
                    form.setValue("vat", "");
                    form.setValue("discount", 0);
                    form.setValue("amountDue", 0);
                  }}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <EstimateServiceForm
        estimates={estimates}
        onAppend={onAdd}
        onRemove={onRemove}
      />

      <Form id="invoiceForm" form={form}>
        <FormInputWrapper>
          <div className="max-w-96">
            <TextareaInput
              fieldName="notes"
              fieldLabel={"Notes"}
              labelPosition="top"
            />
          </div>
        </FormInputWrapper>
        <FormInputWrapper>
          <CheckboxInput
            fieldName="isDiscount"
            fieldLabel={t("applyDiscount")}
            labelPosition="top"
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <div className="max-w-96">
            <DefaultTextInput
              disabled={!isDiscount}
              fieldName="discount"
              fieldLabel={t("discount")}
            />
          </div>
        </FormInputWrapper>

        <div className="flex w-full justify-end">
          <div className="w-72 max-w-72 bg-gray-200 px-4 py-2">
            <table className="w-full">
              <tbody>
                <tr>
                  <td>
                    <h1 className="text-left">Total:</h1>
                  </td>
                  <td className="text-right">
                    <p className="font-bold">
                      {toDecimal(calculateTotal) || 0}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h1 className="text-left">
                      Discount({discount}%): {}
                    </h1>
                  </td>
                  <td className="text-right">
                    <p className="font-bold">
                      {isDiscount ? calculateTotalDiscount.toFixed(2) : "0.00"}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h1 className="text-left">{t("VAT")}:</h1>
                  </td>
                  <td className="text-right">
                    <p className="font-bold">
                      {calculateTotalVat.toFixed(2) || 0.0}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="text-left">
                    <h1 className="">Amount due:</h1>
                  </td>
                  <td className="text-right">
                    <p className="font-bold">
                      {Number(toDecimal(calculateAmountDue)).toFixed(2) ||
                        "0.00"}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-8">
          <Button
            type="button"
            variant={"secondary"}
            size="lg"
            onClick={() => {
              router.push(`/invoices`);
            }}
          >
            {tUI("buttons.cancel")}
          </Button>

          <Button
            type="button"
            disabled={status !== InvoiceStatus.DRAFT}
            onClick={form.handleSubmit(onSubmit)}
            size="lg"
          >
            {tUI("buttons.save")}
          </Button>

          <Button
            type="button"
            disabled={status !== InvoiceStatus.DRAFT}
            onClick={form.handleSubmit((values) => {
              if (id) {
                return updateInvoiceIssueMutation.mutate(values);
              } else {
                return issueInvoiceMutation.mutate(values);
              }
            })}
            size="lg"
            variant="accent"
            className="bg-orange-600"
          >
            {tUI("buttons.issueInvoice")}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateInvoiceForm;
