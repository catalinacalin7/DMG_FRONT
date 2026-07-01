"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import FormInputWrapper from "@/components/FormInputWrapper/FormInputWrapper";
import { Form } from "@/components/ui/form";
import SelectInput from "@/components/inputs/SelectInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import TextInput from "@/components/inputs/TextInput";
import { getVehiclesFor } from "@/api/vehicles/vehicles";
import { getMembersFor } from "@/api/company/members";
import {
  createScheduleEvent,
  getScheduleEventById,
  updateScheduleEventById,
} from "@/api/schedule/schedule";
import { useParams } from "next/navigation";
import { onErrorToast } from "@/utils/onErrorToast";
import LoadingScreen from "@/components/LoadingScreen";
import { useTranslations } from "next-intl";
import { CreateScheduleEvent } from "@/types/schedule";
import { getClientsFor } from "@/api/home-dashboard/home-dashboard";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

const schema = yup.object().shape({
  date: yup.date().required("Field is required"),
  time: yup.string().required("Field is required"),
  clientId: yup.string().required("Field is required"),
  eventLocation: yup.string().optional(),
  vehicleId: yup.string().optional(),
  serviceName: yup.string().required("Field is required"),
  assigneeName: yup.string().required("Field is required"),
  status: yup.string().required("Field is required"),
});

type schemaType = yup.InferType<typeof schema>;

const SchedulingEventForm = () => {
  const t = useTranslations("PageScheduling");
  const tActions = useTranslations("ToastActions");
  const tButton = useTranslations("ui");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data, isLoading: isLoadingEventData } = useQuery({
    queryKey: ["event"],
    queryFn: () => getScheduleEventById(id as string),
    enabled: id ? true : false,
  });
  const form = useForm<schemaType>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date(),
      time: "",
      clientId: "",
      eventLocation: "",
      vehicleId: "",
      serviceName: "",
      assigneeName: "",
      status: "",
    },
  });

  const clientId = form.watch("clientId");
  form.watch().vehicleId;
  form.watch().assigneeName;
  form.watch();

  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: [QUERY_KEYS.clients],
    queryFn: getClientsFor,
  });

  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: [QUERY_KEYS.garages, clientId],
    queryFn: () => getVehiclesFor(clientId as string),
    enabled: !!clientId,
  });

  const { data: team, isLoading: isLoadingTeam } = useQuery({
    queryKey: [QUERY_KEYS.members],
    queryFn: () => getMembersFor(),
  });

  useEffect(() => {
    if (data && !isLoadingEventData) {
      form.setValue("date", data.date);
      form.setValue("time", data.time);
      form.setValue("eventLocation", data.eventLocation);
      form.setValue("serviceName", data.serviceName);
      form.setValue("status", data.status);
      form.setValue("vehicleId", data.vehicleId);
      form.setValue("clientId", data.clientId);
      form.setValue("assigneeName", data.assigneeName);
    }
  }, [
    data,
    isLoadingEventData,
    clients,
    isLoadingClients,
    team,
    isLoadingTeam,
    form,
    vehicles,
    isLoadingVehicles,
  ]);

  useEffect(() => {
    if (!id) {
      form.reset();
    }
  }, [form, id]);

  const createEvent = useMutation({
    mutationFn: async (values: schemaType) => {
      const updatedValues = {
        ...values,
        assigneeName: values.assigneeName,
      };

      await createScheduleEvent(updatedValues as CreateScheduleEvent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [],
      });
      toast.success(t("scheduling"), {
        description: tActions("created"),
      });
      router.replace(`/scheduling`);
    },
    onError: () => {
      toast.error(t("scheduling"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });
  const updateEvent = useMutation({
    mutationFn: async (values: schemaType) => {
      const updatedValues = {
        ...values,
        assigneeName: values.assigneeName,
      };
      await updateScheduleEventById(
        id as string,
        updatedValues as CreateScheduleEvent,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [],
      });
      toast.success(t("scheduling"), {
        description: tActions("updated"),
      });
      router.replace(`/scheduling`);
    },
    onError: () => {
      toast.error(t("scheduling"), {
        description: tActions("somethingWentWrong"),
      });
    },
  });

  const onSubmit = async (values: schemaType) => {
    if (id) {
      updateEvent.mutate(values);
    } else {
      createEvent.mutate(values);
    }
  };

  if (
    isLoadingEventData ||
    isLoadingClients ||
    isLoadingVehicles ||
    isLoadingTeam
  ) {
    return <LoadingScreen />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values);
        })}
      >
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-bold">{t("createSchedulingEvent")}</h2>

            <p className="text-muted-foreground text-sm font-normal">
              {id
                ? `${t("updateEventDetailsDetailsHere")}`
                : `${t("addEventDetailsDetailsHere")}`}
            </p>
          </div>
        </div>

        <div>
          <FormInputWrapper>
            <DatePickerInput
              fieldName="date"
              fieldLabel={t("date")}
              disabledPreviousDates={true}
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <TextInput fieldName="time" fieldLabel={t("time")} type="time" />
          </FormInputWrapper>

          <FormInputWrapper>
            <SelectInput
              fieldName="clientId"
              fieldLabel={t("client")}
              required
              options={
                clients?.map((client) => {
                  return { label: client.name, value: client.id as string };
                }) ?? []
              }
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <SelectInput
              fieldName="vehicleId"
              fieldLabel={t("vehicle")}
              required
              options={
                vehicles?.map((item) => {
                  return {
                    label: `${item.registrationNumber} ${item.make}, ${item.model}`,
                    value: item.id as string,
                  };
                }) ?? []
              }
              disabled={!clientId}
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <TextInput
              fieldName="eventLocation"
              fieldLabel={t("eventLocation")}
              required
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <SelectInput
              fieldName="serviceName"
              fieldLabel={t("service")}
              required
              options={[
                {
                  label: `${t("estimate")}`,
                  value: "estimate",
                },
                { label: `${t("parking")}`, value: "parking" },
                { label: `${t("paint")}`, value: "paint" },
              ]}
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <SelectInput
              fieldName="assigneeName"
              fieldLabel={t("member")}
              required
              options={
                team?.map((member) => {
                  return {
                    label: member?.user?.name,
                    value: member?.user?.name,
                  };
                }) ?? []
              }
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <SelectInput
              fieldName="status"
              fieldLabel={t("status")}
              required
              options={[
                { label: `${t("new")}`, value: "new" },
                { label: `${t("inProgress")}`, value: "in_progress" },
                { label: `${t("complete")}`, value: "completed" },
              ]}
            />
          </FormInputWrapper>
        </div>
        <div className="flex justify-end gap-2 py-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => {
              router.push(id ? `/scheduling/${id}` : `/scheduling`);
            }}
          >
            {tButton("buttons.cancel")}
          </Button>

          <Button type="submit" size="lg">
            {tButton("buttons.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SchedulingEventForm;
