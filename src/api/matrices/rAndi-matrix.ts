import axios, { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import { RemoveAndInstallMatrix } from "@/types/matrices";

export const createRandIMatrix = async (data: RemoveAndInstallMatrix) => {
  try {
    await axiosInstance.post(`/r-and-i`, data);
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

export const getRandIMatrix = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/r-and-i/${id}`);

    return data as RemoveAndInstallMatrix;
  } catch (err) {
    throw err;
  }
};

export const updateRandIMatrix = async (data: RemoveAndInstallMatrix, id: string) => {
  try {
    await axiosInstance.patch(`/r-and-i/${id}`, data);
  } catch (err) {
    throw err;
  }
};


export const deleteRandIMatrix = async (id: string) => {
  try {
    await axiosInstance.delete(`/r-and-i/${id}`);
  } catch (err) {
    throw err;
  }
};

export const getRandIMatrices = async () => {
  try {
    const { data } = await axiosInstance.get(`/r-and-i`);

    return data as [RemoveAndInstallMatrix];
  } catch (err) {
    throw err;
  }
};
