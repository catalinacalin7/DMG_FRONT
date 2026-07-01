import { PrivateClientData } from "@/types/clients";

import axiosInstance from "../axiosInstance";

export const createPrivateClient = async (formData: PrivateClientData) => {
  try {
    const { data } = await axiosInstance.post(
      "/clients/private",
      formData,
    );

    return data as PrivateClientData;
  } catch (err) {
    throw err;
  }
};
