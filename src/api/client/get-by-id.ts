import { BusinessClientData, PrivateClientData } from "@/types/clients";

import axiosInstance from "../axiosInstance";

export const getClientById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/clients/${id}`);

    return data as BusinessClientData | PrivateClientData;
  } catch (err) {
    throw err;
  }
};
