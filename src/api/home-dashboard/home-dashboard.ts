import { MemberDto } from "@/types/company";
import axiosInstance from "../axiosInstance";
import { EstimateHail } from "../estimates/estimates";
import { InvoiceResponse } from "../invoices/invoices";

export interface ClientData {
  id: string;
  name: string;
}

export const getClientsFor = async () => {
  try {
    const { data } = await axiosInstance.get("/clients-for");
    return data as ClientData[];
  } catch (err) {
    throw err;
  }
};

export const getMembersFor = async () => {
  try {
    const { data } = await axiosInstance.get(`/members-for`);
    return data as MemberDto[];
  } catch (err) {
    throw err;
  }
};

export const getEstimatesFor = async ({
  searchQuery,
  status,
  clientId,
}: {
  searchQuery?: string;
  status?: string;
  clientId?: string;
}) => {
  try {
    const { data } = await axiosInstance.get(`/hail-estimates`, {
      params: { searchQuery, status, clientId },
    });
    return data as EstimateHail[];
  } catch (err) {
    throw err;
  }
};

export const getInvoicesFor = async (
  searchQuery: string,
  status: string,
  clientId: string,
) => {
  try {
    const { data } = await axiosInstance.get("/invoices", {
      params: { searchQuery, status, clientId },
    });
    return data as InvoiceResponse[];
  } catch (error) {
    throw error;
  }
};