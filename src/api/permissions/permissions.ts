import { AddOnsType } from "@/types/add-ons";
import axiosInstance from "../axiosInstance";

type Permissions = {
  id?: number;
  role: string;
  subject: string;
  action: string;
}

export const savePermissions = async (data: Permissions[]) => {
  try {
    await axiosInstance.post(`/permissions`, data);
  } catch (err) {
    throw err;
  }
};

export const getPermissions = async (role: string) => {
  try {
    const { data } = await axiosInstance.get(`/permissions/me`, {
      params: {
        role: role,
      },
    });
    return data as Permissions[]
  } catch (err) {
    throw err;
  }
};





