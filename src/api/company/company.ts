import { CompanyFormData, CompanyData, CompanyPaymentData, DeleteAccountData } from "@/types/company";
import axiosInstance from "../axiosInstance";
import axios from "axios";

const axiosInstanceDelete = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export const createCompany = async (data: CompanyFormData) => {
  try {
    await axiosInstance.post(`/company`, data);
  } catch (err) {
    throw err;
  }
};

export const updateCompany = async (data: CompanyFormData) => {
  try {
    await axiosInstance.patch(`/company`, data);
  } catch (err) {
    throw err;
  }
};

export const getCompany = async () => {
  try {
    const { data } = await axiosInstance.get(`/company`);
    return data as CompanyData;
  } catch (err) {
    throw err;
  }
};

export const createCompanyPayment = async (data: CompanyPaymentData) => {
  try {
    await axiosInstance.post(`/company-payment`, data);
  } catch (err) {
    throw err;
  }
};
export const updateCompanyPayment = async (id: string, data: CompanyPaymentData) => {
  try {
    await axiosInstance.patch(`/company-payment/${id}`, data);
  } catch (err) {
    throw err;
  }
};

export const getCompanyPayment = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/company-payment/${id}`);
    return data as CompanyPaymentData;
  } catch (err) {
    throw err;
  }
};
export const deleteCompanyPayment = async (id: string) => {
  try {
    await axiosInstance.delete(`/company-payment/${id}`);
  } catch (err) {
    throw err;
  }
};

export const deleteAccount = async (deleteAccount: DeleteAccountData) => {
  try {
    await axiosInstance.delete(`/users/superadmin/me`, {
      data: deleteAccount
    });
  } catch (err) {
    throw err;
  }
};

export const getCompanyPayments = async () => {
  try {
    const { data } = await axiosInstance.get(`/company-payment`);
    return data as CompanyPaymentData[];
  } catch (err) {
    throw err;
  }
};


export const getLogoCompany = async () => {
  const response = await axiosInstance.get('/company/avatar', { responseType: 'blob' });
  return response.data;
};

export const getCompanyAvatar = async () => {
  try {
    const { data } = await axiosInstance.get(`/company/avatar`, { responseType: 'blob' });
    return URL.createObjectURL(data);
  } catch (err) {
    throw err;
  }
};


export const deleteCompany = async () => {
  try {
    await axiosInstance.delete(`/company`);
  } catch (err) {
    throw err;
  }
};
