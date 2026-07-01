import { BusinessClientData } from "@/types/clients";

import axiosInstance from "../axiosInstance";

export const updateBusinessClient = async (formData: BusinessClientData, id: string) => {
  try {
    const { data } = await axiosInstance.patch(
      `/clients/business/${id}`,
      formData,
    );

    return data as BusinessClientData;
  } catch (err) {
    throw err;
  }
};
