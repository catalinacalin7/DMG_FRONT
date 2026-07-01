import axiosInstance from "@/api/axiosInstance";

export type PayementInfoCreate = {
  accountName: string;
  IBAN: string;
  BIC: string;
  bankName: string;
};

export type PaymentInfo = {
  id: string;
  accountName: string;
  IBAN: string;
  BIC: string;
  bankName: string;
};

export type PaymentInfoDelete = {
  message: string;
};

export const createPaymentInfo = async (
  formData: PayementInfoCreate,
  clientId: string,
) => {
  try {
    await axiosInstance.post(`/client-payments/${clientId}`, formData);
  } catch (err) {
    throw err;
  }
};

export const getPaymentInfo = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`client-payments/${id}`);
    return data as PaymentInfo;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentInfo = async (
  values: PayementInfoCreate,
  clientId: string,
) => {
  try {
    await axiosInstance.patch(`/client-payments/${clientId}`, values);
  } catch (error) {
    throw error;
  }
};

export const deletePaymentInfo = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/client-payments/${id}`);
    return data as PaymentInfoDelete;
  } catch (error) {
    throw error;
  }
};
