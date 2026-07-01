import axiosInstance from "../../axiosInstance";

export const deleteClientContact = async (id: number) => {
  try {
    await axiosInstance.delete(`/client-contacts/delete/${id}`);
  } catch (err) {
    throw err;
  }
};
