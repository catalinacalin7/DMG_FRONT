import { CreateScheduleEvent, ScheduleEvent } from "@/types/schedule";

import axiosInstance from "../axiosInstance";

export const createScheduleEvent = async (data: CreateScheduleEvent) => {
  try {
    await axiosInstance.post(`/schedulings`, data);
  } catch (err) {
    throw err;
  }
};

export const getScheduleEvents = async () => {
  try {
    const { data } = await axiosInstance.get(`/schedulings`);

    return data as ScheduleEvent[];
  } catch (err) {
    throw err;
  }
};

export const getScheduleEventById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/schedulings/${id}`);

    return data as ScheduleEvent;
  } catch (err) {
    throw err;
  }
};

export const updateScheduleEventById = async (
  id: string,
  values: CreateScheduleEvent,
) => {
  try {
    const { data } = await axiosInstance.patch(`/schedulings/${id}`, values);

    return data as CreateScheduleEvent;
  } catch (err) {
    throw err;
  }
};

export const deleteScheduleEventById = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/schedulings/${id}`);

    return data as { message: string };
  } catch (err) {
    throw err;
  }
};
