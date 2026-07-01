import { ClientContactData } from "@/types/clients";

import axiosInstance from "../../axiosInstance";

export const createClientContact = async (
  formData: ClientContactData,
  clientId: string,
) => {
  try {
    const { data } = await axiosInstance.post(
      `/client-contacts/create/${clientId}`,
      formData,
    );

    return data as ClientContactData;
  } catch (err) {
    throw err;
  }
};
