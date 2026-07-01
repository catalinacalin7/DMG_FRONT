import { BusinessClientData, PrivateClientData } from "@/types/clients";

import axiosInstance from "../axiosInstance";
import { ClientData } from "../home-dashboard/home-dashboard";

export const getAllClients = async ({
  searchQuery,
  clientType,
}: {
  searchQuery?: string;
  clientType?: string;
}) => {
  try {
    const { data } = await axiosInstance.get("/clients", {
      params: {
        searchQuery,
        clientType,
      },
    });
    return data as (BusinessClientData | PrivateClientData)[];
  } catch (err) {
    throw err;
  }
};

export const getClientsFor = async () => {
  try {
    const { data } = await axiosInstance.get("/clients-for");
    return data as ClientData[];
  } catch (err) {
    throw err;
  }
};