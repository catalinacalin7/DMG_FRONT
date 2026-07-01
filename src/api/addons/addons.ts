import { AddOnsType } from "@/types/add-ons";
import axiosInstance from "../axiosInstance";

export const saveAddons = async (data: AddOnsType[]) => {
  try {
    await axiosInstance.post(`/add-ons`, data);
  } catch (err) {
    throw err;
  }
};

export const getAddons = async (isOn?: boolean) => {
  try {
    const { data } = await axiosInstance.get(`/add-ons`, {
      params: {
        isOn: isOn,
      },
    });
    return data as AddOnsType[]
  } catch (err) {
    throw err;
  }
};





