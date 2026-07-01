import axios, { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";

export type FranceRemoveInstall = {
  id?: string;
  categoryA: number;
  categoryB: number;
  categoryC: number;
  categoryD: number;
}

export const createFranceRemoveInstall = async (data: FranceRemoveInstall) => {
  try {
    await axiosInstance.post(`/france-remove-install`, data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{
        message: string;
        error?: string;
        statusCode?: number;
      }>;

      throw axiosError.response?.data;
    } else {
      throw err;
    }
  }
};

export const updateFranceRemoveInstall = async (data: FranceRemoveInstall, id: string) => {
  try {
    await axiosInstance.patch(`/france-remove-install/${id}`, data);
  } catch (err) {
    throw err;
  }
};


export const getFranceRemoveInstall = async () => {
  try {
    const { data } = await axiosInstance.get(`/france-remove-install`);

    return data as FranceRemoveInstall;
  } catch (err) {
    throw err;
  }
};