import { UserRegisterFormData } from "@/types/users";

import axiosInstance from "../axiosInstance";

export const register = async (formData: UserRegisterFormData) => {
  try {
    const { data } = await axiosInstance.post(
      "/users/superadmin/register",
      formData,
    );

    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteAvatar = async (userId: string) => {
  try {
    await axiosInstance.delete(`/users/superadmin/delete/avatar/${userId}`);
  } catch (err) {
    throw err;
  }
};
export const getAvatar = async (userId: string) => {
  try {
    const { data } = await axiosInstance.get(
      `/company/avatar`,
    );

    return data as string;
  } catch (err) {
    throw err;
  }
};

export const uploadAvatar = async (formData: FormData) => {
  try {
    const { data } = await axiosInstance.post(
      `/company/avatar`,
      formData,
    );

    return data as string;
  } catch (err) {
    throw err;
  }
};
