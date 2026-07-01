import { BusinessClientData } from "@/types/clients";

import axiosInstance from "../axiosInstance";

export const createBusinessClient = async (formData: BusinessClientData) => {
  try {
    const { data } = await axiosInstance.post(
      "/clients/business",
      formData,
    );

    return data as BusinessClientData;
  } catch (err) {
    throw err;
  }
};
