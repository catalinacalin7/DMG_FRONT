import axiosInstance from "../axiosInstance";

export const deleteClient = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/clients/${id}`);

    return data;
  } catch (err) {
    throw err;
  }
};
