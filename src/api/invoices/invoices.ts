import { BusinessClientData, PrivateClientData } from "@/types/clients";
import axiosInstance from "../axiosInstance";
import { VehicleData } from "@/types/vehicle";

export type CreateInvoice = {
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  sentDate: Date;
  amountDue: number;
  total: number;
  currency: string;
  vatPercentage: number;
  discount: number;
  estimateService: EstimateService[];
};

export type InvoiceNumber = {
  id?: string;
  prefix: string;
  lastNumber: number;
};

export type EstimateHailService = {
  estimateNumber: string;
  cliendId: string;
  companyId: string;
  createdAd: Date;
  discount: number;
  hailMatrixId: string;
  id: string;
  rAndImatrixId: string;
  rate: number;
  status: string;
  total: number;
  updatedAt: Date;
  userId: string;
  vehicleId: string;
  vehicle: VehicleData;
};

export type EstimateService = {
  serviceName: string;
  description: string;
  measuringUnit: string;
  quantity: number;
  unitPrice: number;
  price: number;
  estimateHailId: string;
}

export type InvoiceResponse = {
  id: string;
  series: string,
  number: string,
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  sentDate: Date;
  vatPercentage: number;
  amountDue: number;
  total: number;
  currency: string;
  isDiscount: boolean;
  discount: number;
  notes: string;
  estimateService: EstimateService[];
  createdAt: Date;
  updatedAt: Date;
  client: BusinessClientData | PrivateClientData;
  status: string;
  userId: string;
};

export type InvoiceLabelsTranslations = {
  invoice: string;
  client: string;
  supplier: string;
  issueDate: string;
  dueDate: string;
  regNo: string;
  taxID: string;
  address: string;
  iban: string;
  swift: string;
  phone: string;
  email: string;
  shareCapital: string;
  nr: string;
  serviceName: string;
  measuringUnit: string;
  quantity: string;
  unitPrice: string;
  price: string;
  vat: string;
  subtotal: string;
  total: string;
  county: string;
  country: string;
}

export type InvoiceDownload = {
  id: string;
  invoiceLabels: InvoiceLabelsTranslations
}

export type SendInvoice = {
  id: string,
  email: {
    emailAddress: string;
    subject: string;
    message: string;
  }
  invoiceLabels: InvoiceLabelsTranslations
}

export const createInvoice = async (values: CreateInvoice) => {
  try {
    const { data: response } = await axiosInstance.post(`/invoices`, values);
    return response as CreateInvoice;
  } catch (err) {
    throw err;
  }
};

export const issueInvoice = async (values: CreateInvoice) => {
  try {
    const { data: response } = await axiosInstance.post(`/invoices/issue`, values);
    return response as CreateInvoice;
  } catch (err) {
    throw err;
  }
};

export const getInvoices = async (
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

export const invoicesByVehicelId = async (vehicleId: string) => {
  try {
    const { data } = await axiosInstance.get(`/invoices-by-vehicle/${vehicleId}`);
    return data as InvoiceResponse[];
  } catch (err) {
    throw err;
  }
};

export const getInvoice = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/invoices/${id}`);
    return data as InvoiceResponse;
  } catch (error) {
    throw error;
  }
};

export const updateInvoice = async (id: string, values: CreateInvoice) => {
  try {
    const { data } = await axiosInstance.patch(`/invoices/${id}`, values);
    return data as CreateInvoice;
  } catch (error) {
    throw error;
  }
};

export const updateInvoiceIssue = async (id: string, values: CreateInvoice) => {
  try {
    const { data } = await axiosInstance.patch(`/invoices/issue/${id}`, values);
    return data as CreateInvoice;
  } catch (error) {
    throw error;
  }
};

export const deleteInvoice = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/invoices/${id}`);
    return data as { message: string };
  } catch (error) {
    throw error;
  }
};

export const addEstimateToInvoice = async (
  invoiceId: string,
  estimateId: string,
) => {
  try {
    await axiosInstance.post(`/invoices/${invoiceId}/estimates`, {
      estimateId,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteEstimateFromInvoice = async (
  invoiceId: string,
  estimateId: string,
) => {
  try {
    const { data } = await axiosInstance.delete(
      `/invoices/${invoiceId}/estimates/${estimateId}`,
    );
    return data as { message: string };
  } catch (error) {
    throw error;
  }
};

export const downloadInvoice = async ({ id, invoiceLabels }: InvoiceDownload) => {
  try {
    const response = await axiosInstance.post(`/invoices/${id}/download`,
      invoiceLabels,
      {
        responseType: 'blob',
      });

    const contentDisposition = response.headers['content-disposition'];

    const filename =
      contentDisposition?.match(/filename="?(.+?)"?$/)?.[1];
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);


    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
};

export const sendInvoice = async (values: SendInvoice) => {
  try {
    await axiosInstance.post(`/invoices/${values.id}/send`, values);
  } catch (error) {
    throw error;
  }
};

export const updateInvoiceStatus = async (id: String, status: string) => {
  try {
    await axiosInstance.post(`/invoices/${id}/send`, status);
  } catch (error) {
    throw error;
  }
};

export const createInvoiceNumber = async (values: InvoiceNumber) => {
  try {
    const { data: response } = await axiosInstance.post(`/invoice-number`, values);
    return response as InvoiceNumber;
  } catch (err) {
    throw err;
  }
};

export const updateInvoiceNumber = async (values: InvoiceNumber, id: string) => {
  try {
    const { data: response } = await axiosInstance.patch(`/invoice-number/${id}`, values);
    return response as InvoiceNumber;
  } catch (err) {
    throw err;
  }
};

export const getInvoiceNumber = async () => {
  try {
    const { data: response } = await axiosInstance.get(`/invoice-number`);
    return response as InvoiceNumber;
  } catch (err) {
    throw err;
  }
};