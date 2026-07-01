import { VehicleData, VehicleImage } from "@/types/vehicle";

import axiosInstance from "../axiosInstance";

export const createVehicle = async (
  clientId: string,
  formData: VehicleData,
) => {
  try {
    const { data } = await axiosInstance.post(
      `/vehicles/create/${clientId}`,
      formData,
    );

    return data as VehicleData;
  } catch (err) {
    throw err;
  }
};

export const deleteVehicle = async (id: string) => {
  try {
    await axiosInstance.delete(`/vehicles/delete/${id}`);
  } catch (err) {
    throw err;
  }
};

export const getAllVehicles = async (clientId: string) => {
  try {
    const { data } = await axiosInstance.get(`/vehicles/get-all/${clientId}`);

    return data as VehicleData[];
  } catch (err) {
    throw err;
  }
};



export const getVehicle = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/vehicles/get/${id}`);

    return data as VehicleData;
  } catch (err) {
    throw err;
  }
};

export const updateVehicle = async (formData: VehicleData, id: string) => {
  try {
    const { data } = await axiosInstance.patch(
      `/vehicles/update/${id}`,
      formData,
    );

    return data;
  } catch (err) {
    throw err;
  }
};

export const getVehiclesFor = async (clientId: string) => {
  try {
    const { data } = await axiosInstance.get(`/vehicles/vehicles-for/${clientId}`);

    return data as VehicleData[];
  } catch (err) {
    throw err;
  }
};
