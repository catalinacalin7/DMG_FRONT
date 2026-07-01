"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { createVehicle, updateVehicle } from "@/api/vehicles/vehicles";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { VehicleData } from "@/types/vehicle";
import { toast } from "sonner";
import TextInput from "@/components/inputs/TextInput";
import SelectInput from "@/components/inputs/SelectInput";
import NumericFormatInput from "@/components/inputs/NumericFormatInput";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { getCarByVin, getCarsByMake } from "@/api/external/getVehicles";
import { capitalize } from "@/utils/capitalize";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { InputSearchSelector } from "@/components/inputs/InputSearchSelector";

const schema = yup.object().shape({
  vinNumber: yup
    .string()
    .optional()
    .max(17, "Vin number should not exceed 17 characters"),
  make: yup.string().required("Make is required"),
  model: yup.string().required("Model is required"),
  registrationNumber: yup.string().uppercase().optional(),
  year: yup.string().optional().max(4, "Year must be 4 digits"),
  vehicleType: yup
    .mixed()
    .oneOf(
      [
        "sedan",
        "hatchback",
        "suv",
        "coupe",
        "convertible",
        "pickup_truck",
        "van",
        "wagon",
        "crossover",
      ],
      "Vehicle type is required",
    ),
  engine: yup.string().optional(),
  doors: yup.string().optional(),
  odometer: yup.string().optional(),
  fuel: yup.string().optional(),
});

const VehicleTypeOptions = [
  { label: "sedan", value: "sedan" },
  { label: "hatchback", value: "hatchback" },
  { label: "suv", value: "suv" },
  { label: "coupe", value: "coupe" },
  { label: "convertible", value: "convertible" },
  { label: "pickupTruck", value: "pickup_truck" },
  { label: "van", value: "van" },
  { label: "wagon", value: "wagon" },
  { label: "crossover", value: "crossover" },
];

const FuleTypeOptions = [
  { label: "petrol", value: "gasoline" },
  { label: "diesel", value: "diesel" },
  { label: "electric", value: "electric" },
  { label: "hybrid", value: "hybrid" },
  { label: "cng", value: "cng" },
  { label: "lpg", value: "lpg" },
  { label: "hydrogen", value: "hydrogen" },
];

const AddVehicleForm = ({ vehicleData }: { vehicleData?: VehicleData }) => {
  const t = useTranslations("Garage");
  const tClient = useTranslations("PageClients");
  const tEstimates = useTranslations("PageEstimates");
  const tUI = useTranslations("ui");
  const { id, vehicleId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDebounced] = useDebounce(searchQuery, 100);

  const form = useForm({
    values: vehicleData
      ? {
          ...vehicleData,
          year: String(vehicleData.year),
        }
      : {
          doors: "",
          engine: "",
          fuel: "",
          make: "",
          model: "",
          registrationNumber: "",
          odometer: "",
          vehicleType: "",
          vinNumber: "",
          year: "",
        },
    resolver: yupResolver(schema),
    mode: "all",
  });

  const submitFormMutation = useMutation({
    mutationFn: async (formData: VehicleData) => {
      return await createVehicle(id as string, {
        ...formData,
        make: formData.make,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.garages, id],
        refetchType: "all",
      });
      toast.success(t("vehicles"), {
        description: tClient("created"),
      });
      form.reset();
      const redirectUrl = searchParams.get("redirectUrl");
      if (redirectUrl) {
        router.push(`${redirectUrl}?clientId=${id}&vehicleId=${data.id}`);
      } else {
        router.replace(`/clients/${id}/garage`);
      }
    },
    onError: () => {
      toast.error(t("vehicles"), {
        description: tClient("somethingWentWrong"),
      });
    },
  });

  const vehicleUpdate = useMutation({
    mutationFn: async (formData: VehicleData) => {
      const newData = {
        vehicleType: formData.vehicleType,
        vinNumber: formData.vinNumber,
        make: formData.make,
        model: formData.model,
        registrationNumber: formData.registrationNumber,
        year: formData.year,
        engine: formData.engine,
        doors: formData.doors,
        odometer: formData.odometer,
        fuel: formData.fuel,
      };
      await updateVehicle(newData, vehicleId as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.garages, id],
        refetchType: "all",
      });
      toast.success(t("vehicles"), {
        description: tClient("updated"),
      });
      form.reset();
      router.replace(`/clients/${id}/garage`);
    },
    onError: () => {
      toast.error(t("vehicles"), {
        description: tClient("somethingWentWrong"),
      });
    },
  });

  const {
    data: carMakes,
    isLoading: isLoadingMake,
    refetch: getCarMake,
  } = useQuery({
    queryKey: ["carMake", searchQueryDebounced],
    queryFn: async () => {
      return await getCarsByMake(searchQueryDebounced);
    },
    enabled: !!searchQueryDebounced,
  });

  const {
    data: carData,
    isLoading: isLoadingVinInfo,
    isSuccess,
    refetch: getVinInfo,
  } = useQuery({
    queryKey: ["vinCode"],
    queryFn: async () => {
      // return await getCarByVin(form.getValues().vinNumber).then((res) => {
      //   setSearchQuery(res.make);
      //   setCarMake(res.make);
      //   form.setValue("vehicleType", res.vehicleType);
      //   form.setValue("fuel", res.fuelType);
      //   form.setValue("doors", res.doors);
      //   form.setValue("year", res.year);
      //   form.setValue("make", res.make);
      //   form.setValue("model", res.model);
      //   form.setValue("engine", parseFloat(res.engine).toString());
      //   form.trigger(["year", "make", "model", "engine"]);
      //   return res;
      // });
      const res = await getCarByVin(form.getValues().vinNumber);

      const make = await getCarsByMake(res.make);
      form.setValue("vehicleType", res.vehicleType);
      form.setValue("fuel", res.fuelType);
      form.setValue("doors", res.doors);
      form.setValue("year", res.year);
      if (make?.results[0]?.make.toLowerCase() === res.make.toLowerCase()) {
        form.setValue("make", make?.results[0]?.make);
      } else {
        form.setValue("make", res?.make);
      }
      form.setValue("model", res.model);
      form.setValue("engine", parseFloat(res.engine).toString());
      form.trigger(["year", "make", "model", "engine"]);

      return res;
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    getCarMake();
  }, [searchQueryDebounced, getCarMake]);

  return (
    <div className="flex flex-col gap-6 pb-[100px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((formData) => {
            if (!!vehicleId) {
              const transformedData = {
                ...formData,
                year: parseInt(formData.year),
              };
              return vehicleUpdate.mutate(transformedData as VehicleData);
            } else {
              const transformedData = {
                ...formData,
                year: parseInt(formData.year),
              };
              return submitFormMutation.mutate(transformedData as VehicleData);
            }
          })}
        >
          <FormInputWrapper>
            <TextInput
              fieldName="vinNumber"
              fieldLabel={t("vinNumber")}
              withButton={
                <Button
                  type="button"
                  className="!px-5"
                  onClick={() => getVinInfo()}
                  disabled={isLoadingVinInfo}
                >
                  <Search />
                </Button>
              }
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <InputSearchSelector
              fieldName="make"
              fieldLabel={t("make")}
              onFieldChange={setSearchQuery}
              options={carMakes?.results?.map((make) => make.make) || []}
            />
          </FormInputWrapper>
          <FormInputWrapper>
            <TextInput fieldName="model" fieldLabel={t("model")} />
          </FormInputWrapper>
          <FormInputWrapper>
            <SelectInput
              fieldName="vehicleType"
              fieldLabel={t("vehicleType")}
              options={VehicleTypeOptions.map((option) => ({
                label: t(option.label),
                value: option.value,
              }))}
            />
          </FormInputWrapper>
          <FormInputWrapper>
            <TextInput
              fieldName="registrationNumber"
              fieldLabel={tEstimates("registrationNumber")}
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <NumericFormatInput
              fieldName="year"
              fieldLabel={t("year")}
              thousandSeparator={false}
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <NumericFormatInput
              fieldName="engine"
              fieldLabel={t("engineCm3")}
              thousandSeparator={false}
              suffix={t("cm3")}
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <SelectInput
              fieldName="doors"
              fieldLabel={t("doors")}
              options={[
                { label: `2${t("doors")}`, value: "2" },
                { label: `3${t("doors")}`, value: "3" },
                { label: `4${t("doors")}`, value: "4" },
                { label: `5${t("doors")}`, value: "5" },
              ]}
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <NumericFormatInput
              fieldName="odometer"
              fieldLabel={t("odometer")}
              suffix={t("km")}
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <SelectInput
              fieldName="fuel"
              fieldLabel={t("fuelType")}
              options={FuleTypeOptions.map((option) => ({
                label: t(option.label),
                value: option.value,
              }))}
              placeholder={tUI("placeholders.selectFuelType")}
            />
          </FormInputWrapper>

          <div className="flex justify-end gap-2 py-4">
            <Button
              type="button"
              size="lg"
              variant={"secondary"}
              onClick={() => {
                form.reset();
                router.push(`/clients/${id}/garage`);
              }}
            >
              {tUI("buttons.cancel")}
            </Button>
            <Button
              size="lg"
              type="submit"
              disabled={submitFormMutation.isPending}
            >
              {tUI("buttons.save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddVehicleForm;
