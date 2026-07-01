import axios, { AxiosError } from "axios";

import axiosInstance from "../axiosInstance";

export type FranceHailMatrix = {
  rate: number;
  light: number;
  medium: number;
  strong: number;
  aluminium: number;
  technicalDents: number;
  repairAndPaint: number;
  cowl: number;
  door: number;
  fender: number;
  quarter: number;
  hood: number;
  windScreenFrame: number;
  roof: number;
  rail: number;
  trunk: number;
  rocker: number;
  franceHailData: {
    min: number;
    max: number;
    unitsTime: number;
  }[];
}

export const createFranceHailMatrix = async (data: FranceHailMatrix) => {
  try {
    await axiosInstance.post(`/france-hail`, data);
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

export const updateFranceHailMatrix = async (data: FranceHailMatrix) => {
  try {
    await axiosInstance.patch(`/france-hail`, data);
  } catch (err) {
    throw err;
  }
};


export const getFranceMatrix = async () => {
  try {
    const { data } = await axiosInstance.get(`/france-hail`);

    return data as FranceHailMatrix;
  } catch (err) {
    throw err;
  }
};
