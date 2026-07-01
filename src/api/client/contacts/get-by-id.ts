import { ClientContactData } from "@/types/clients";

import axiosInstance from "../../axiosInstance";

export const getClientContact = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/client-contacts/get/${id}`);

    return data as ClientContactData;
  } catch (err) {
    throw err;
  }
};
