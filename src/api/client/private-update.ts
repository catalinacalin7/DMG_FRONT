import { PrivateClientData } from "@/types/clients";

import axiosInstance from "../axiosInstance";

export const updatePrivateClient = async (
  formData: PrivateClientData,
  id: string,
) => {
  try {
    const { data } = await axiosInstance.patch(
      `/clients/private/${id}`,
      formData,
    );

    return data as PrivateClientData;
  } catch (err) {
    throw err;
  }
};
