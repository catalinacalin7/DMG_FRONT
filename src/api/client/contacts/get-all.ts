import { ClientContactData } from "@/types/clients";

import axiosInstance from "../../axiosInstance";

export const getAllClientContacts = async (clientId: string) => {
  try {
    const { data } = await axiosInstance.get(
      `/client-contacts/get-all/${clientId}`,
    );

    return data as ClientContactData[];
  } catch (err) {
    throw err;
  }
};
