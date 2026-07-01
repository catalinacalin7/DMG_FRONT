import { ClientContactData } from "@/types/clients";

import axiosInstance from "../../axiosInstance";

export const updateClientContact = async (
  formData: ClientContactData,
  id: string,
) => {
  try {
    const { data } = await axiosInstance.patch(
      `/client-contacts/update/${id}`,
      formData,
    );

    return data as ClientContactData;
  } catch (err) {
    throw err;
  }
};
