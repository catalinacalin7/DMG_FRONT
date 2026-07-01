import { UserData } from "@/types/users";

import axiosInstance from "../axiosInstance";

export const getUserData = async () => {
  try {
    const { data } = await axiosInstance.get("/auth/me");

    return data as UserData;
  } catch (err) {
    throw err;
  }
};
