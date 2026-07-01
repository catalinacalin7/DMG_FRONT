"use client";

import { EstimateHail, getHailEstimateById } from "@/api/estimates/estimates";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import DefaultTextInput from "@/components/inputs/DefaultTextInput";
import { SearchSelector } from "@/components/inputs/SearchSelector";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { EstimateService } from "./CreateInvoiceForm";
import { useEffect, useState } from "react";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import SelectLabelTop from "@/components/inputs/SelectLabelTop";
import TextareaInput from "@/components/inputs/TextareaInput";
import { useTranslations } from "next-intl";
import { toDecimal, toInteger } from "@/utils/numberUtils";
import Form from "@/components/inputs/Form";
import { calculatePercentage } from "@/utils/calculatePercentage";

export const estimateServiceSchema = yup.object().shape({
  serviceName: yup
    .string()
    .typeError("Field is required")
    .required("Field is required"),
  description: yup
    .string()
    .typeError("Field is required")
    .required("Field is required"),
  measuringUnit: yup
    .string()
    .typeError("Field is required")
    .required("Field is required"),
  quantity: yup
    .number()
    .typeError("Field is required")
    .required("Field is required"),
  unitPrice: yup
    .number()
    .typeError("Field is required")
    .required("Field is required"),
  price: yup
    .number()
    .typeError("Field is required")
    .required("Field is required"),
  estimateHailId: yup
    .string()
    .typeError("Field is required")
    .required("Field is required"),
});

type EstimateServiceFormProps = {
  onAppend: (item: EstimateService) => void;
  onRemove: (index: number) => void;
  estimates: EstimateHail[];
};

function EstimateServiceForm({
  estimates,
  onAppend,
}: EstimateServiceFormProps) {
  const [estimateId, setEstimateId] = useState<string | null>(null);
  const t = useTranslations("PageInvoices");
  const tGarage = useTranslations("Garage");
  const tEstimates = useTranslations("PageEstimates");

  const form = useForm<EstimateService>({
    resolver: yupResolver(estimateServiceSchema),
    defaultValues: {
      serviceName: "",
      description: "",
      measuringUnit: "",
      quantity: 0,
      unitPrice: 0,
      price: 0,
      estimateHailId: "",
    },
  });

  const {
    data: estimateHail,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: [QUERY_KEYS.getHailEstimate, estimateId],
    queryFn: () => getHailEstimateById(estimateId as string),
    enabled: !!estimateId,
  });

  useEffect(() => {
    if (isFetched) {
      form.setValue("serviceName", "Pdr");
      form.setValue("quantity", 1);
      form.setValue("measuringUnit", "piece");
      form.setValue("unitPrice", +toDecimal(+estimateHail?.retainedPrice));
      form.setValue("price", +toDecimal(+estimateHail?.retainedPrice));
      form.setValue(
        "description",
        `${tGarage("vinNumber")}: ${estimateHail?.vehicle?.vinNumber}\n${tEstimates("registrationNumber")}: ${estimateHail?.vehicle?.registrationNumber}\n${tEstimates("estimateNumber")}: ${estimateHail?.estimateNumber}\n${tGarage("make")}: ${estimateHail?.vehicle?.make}\n${tGarage("model")}: ${estimateHail?.vehicle?.model}\n${tGarage("year")}: ${estimateHail?.vehicle?.year}`,
      );
    }
  }, [isFetched]);

  const onSubmit = (data) => {
    onAppend({
      serviceName: data.serviceName,
      description: data.description,
      measuringUnit: data.measuringUnit,
      quantity: data.quantity,
      unitPrice: toInteger(data.unitPrice),
      price: toInteger(data.price),
      estimateHailId: data.estimateHailId,
    });
    form.reset();
    setEstimateId(null);
  };

  return (
    <Form id="invoice-service" form={form}>
      <div className="border border-gray-200 p-2">
        <FormInputWrapper>
          <SearchSelector
            fieldName="estimateHailId"
            fieldLabel={t("estimates")}
            onSelect={setEstimateId}
            options={
              estimates?.map((estimate) => {
                return {
                  label:
                    `${estimate.registrationNumber}, ${estimate.vehicle?.make} ${estimate.vehicle?.model}, ${estimate.vehicle?.year}` as string,
                  value: estimate.id as string,
                };
              }) || []
            }
          />
        </FormInputWrapper>
        <div className="grid w-full grid-cols-1 flex-col items-start justify-between gap-2 py-2 lg:grid-cols-2 xl:grid-cols-3">
          <div className="flex w-full flex-col gap-2">
            <DefaultTextInput
              fieldName="serviceName"
              fieldLabel={t("serviceName")}
            />
            <TextareaInput
              fieldName="description"
              fieldLabel={t("description")}
              labelPosition="top"
            />
          </div>
          <div className="flex w-full gap-2">
            <DefaultTextInput fieldName="quantity" fieldLabel={t("quantity")} />
            <SelectLabelTop
              fieldName="measuringUnit"
              fieldLabel={t("measuringUnit")}
              options={[
                { label: t("unitPiece"), value: "piece" },
                { label: t("unitService"), value: "service" },
              ]}
            />
          </div>
          <div className="flex w-full gap-2">
            <DefaultTextInput
              fieldName="unitPrice"
              fieldLabel={t("unitPrice")}
            />
            <DefaultTextInput fieldName="price" fieldLabel={t("price")} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" onClick={form.handleSubmit(onSubmit)} size="lg">
            {"Add"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
export default EstimateServiceForm;
