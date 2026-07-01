import { CreateHailMatrix, HailMatrix, UpdateHailMatrix } from "@/types/matrices";
import axios, { AxiosError } from "axios";

import axiosInstance from "../axiosInstance";

export const createHailMatrix = async (data: CreateHailMatrix) => {
  try {
    await axiosInstance.post(`/hail`, data);
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


export const updateHailMatrix = async (
  data: UpdateHailMatrix,
  matrixId: string,
) => {
  try {
    await axiosInstance.patch(`/hail/${matrixId}`, data);
  } catch (err) {
    throw err;
  }
};


export const getMatrixById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/hail/${id}`);

    return data as HailMatrix;
  } catch (err) {
    throw err;
  }
};

export const deleteHailMatrix = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/hail/${id}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const getHailMatrices = async () => {
  try {
    const { data } = await axiosInstance.get(`/hail`);

    return data as [HailMatrix];
  } catch (err) {
    throw err;
  }
};
