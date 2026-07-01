import axios, { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import { VehicleImage } from "@/types/vehicle";
import { PdfLabels } from "@/features/estimates/types/types";

export type EstimateHail = {
  id?: string;
  estimateNumber: string;
  status?: string;
  estimateMode: string;
  registrationNumber?: string;
  removeInstall: string;
  currency: string;
  total: number;
  retainedPrice: string;
  rate: number;
  discount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  clientId: string;
  hailMatrixId: string;
  rAndImatrixId: string;
  companyId?: number;
  vehicleId: string;
  userId?: string;
  estimateHailPanel: EstimateHailPanel[];
  vehicle?: {
    id?: string;
    vehicleType: string;
    registrationNumber: string;
    vinNumber: string;
    createdAt: string;
    updatedAt: string;
    make: string;
    model: string;
    year: number;
    engine: string;
    doors: string;
    odometer: string;
    fuel: string;
    clientId: string;
  };
  client?: Client;
  user?: User;
};
export type CreateEstimateHail = {
  id?: string;
  estimateNumber: string;
  status?: string;
  estimateMode: string;
  registrationNumber?: string;
  removeInstall: number;
  currency: string;
  total: number;
  retainedPrice: number;
  discount?: number;
  clientId: string;
  hailMatrixId: string;
  rAndImatrixId: string;
  companyId?: number;
  vehicleId: string;
  userId?: string;
  estimateHailPanel: EstimateHailPanel[];
  user?: User;
};

type Client = {
  id?: string;
  name: string;
  address: string;
  country: string;
  city: string;
  zipCode: string | null;
  vatRate: number;
  taxID: string | null;
  vatID: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  clientType: ClientType;
  avatar: string | null;
  userId: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

enum ClientType {
  BUSINESS,
  PRIVATE,
}

export type EstimateHailPanel = {
  id?: string;
  panel: string;
  panelStatus: PanelSatus;
  isPaint: boolean;
  panelTotal: number;
  light: string | null;
  medium: string | null;
  strong: string | null;
  technicalDentsCount: number;
  technicalDentsCost: number;
  lightQuotient: number | null;
  mediumQuotient: number | null;
  strongQuotient: number | null;
  isAluminium: boolean;
  isRandI: boolean;
  rAndI: number | null;
  comment: string;
  estimateId: string;
  addOns: HailEstimateAddOns[];
  estimatePanelLabel: PanelLabel[]
};

export type HailEstimateAddOns = {
  id?: string;
  name: string;
  isPercentages: boolean;
  amount: number;
  estimateHailPanelId: string;
};

type PanelLabel = { label: string };


export enum PanelSatus {
  pdr = "pdr",
  repairAndPaint = "repairAndPaint",
  noDamage = "noDamage",
  change = "change",
  hOff = "hOff",
}

export type PanelImage = {
  panel: string;
  ["panel-image"]: File;
}

export type PanelImages = {
  id: string;
  panel: string;
  url: string;
}[] | null;

export type SendPdf = {
  email: string;
  subject: string;
  message: string;
  pdf: Blob;
}

export type EstimateStatus = {
  status: "approved" | "waiting_approve" | "declined";
};

export type EstimateDownload = {
  id: string;
  estimate: {
    estimate: EstimateHail;
    pdfLables: PdfLabels;
  }
}

export type SendEstimate = {
  email: {
    emailAddress: string;
    subject: string;
    message: string;
  }
  estimate: {
    estimate: EstimateHail;
    pdfLables: PdfLabels;
  }
}

export const hailEstimate = async (data: CreateEstimateHail) => {
  try {
    const res = await axiosInstance.post(`/hail-estimates`, data);
    return res.data;
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

export const getHailEstimates = async ({
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

export const estimatesByVehicelId = async (vehicleId: string) => {
  try {
    const { data } = await axiosInstance.get(`/estimates-by-vehicle/${vehicleId}`);
    return data as EstimateHail[];
  } catch (err) {
    throw err;
  }
};

export const getEstimatesFor = async ({
  searchQuery,
  clientId,
}: {
  searchQuery?: string;
  clientId?: string;
}) => {
  try {
    const { data } = await axiosInstance.get(`/estimates-for-invoices`, {
      params: { searchQuery, clientId },
    });
    return data as EstimateHail[];
  } catch (err) {
    throw err;
  }
};

export const getHailEstimateById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/hail-estimates/${id}`);
    return data as EstimateHail;
  } catch (err) {
    throw err;
  }
};

export const updateHailEstimate = async (
  formData: CreateEstimateHail,
  id: string,
) => {
  try {
    const { data } = await axiosInstance.patch(
      `/hail-estimates/${id}`,
      formData,
    );
    return data as EstimateHail;
  } catch (err) {
    throw err;
  }
};

export const deleteHailEstimate = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/hail-estimates/${id}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const changeEstimateStatus = async (
  data: EstimateStatus,
  id: string,
) => {
  try {
    await axiosInstance.patch(`/hail-estimates/${id}/status`, data);
  } catch (error) {
    throw error;
  }
};

export const uploadPanelImage = async (
  estimateId: string,
  formData: PanelImage,
) => {
  try {
    await axiosInstance.post(`/panel-image/${estimateId}`, formData);
  } catch (err) {
    throw err;
  }
};

export const getPanelImages = async (estimateId: string) => {
  try {
    const { data } = await axiosInstance.get(`/panel-image/${estimateId}`);

    return data as PanelImages;
  } catch (err) {
    throw err;
  }
};

export const deletePanelImage = async (imageId: string) => {
  try {
    await axiosInstance.delete(`/panel-image/${imageId}`);
  } catch (err) {
    throw err;
  }
};

export const uploadVehicleImage = async (
  estimateId: string,
  formData: VehicleImage,
) => {
  try {
    await axiosInstance.post(`/vehicle-image/${estimateId}`, formData);
  } catch (err) {
    throw err;
  }
};


export const getVehicleImages = async (estimateId: string) => {
  try {
    const { data } = await axiosInstance.get(
      `/vehicle-image/${estimateId}`,
    );

    return data as VehicleImage[];
  } catch (err) {
    throw err;
  }
};

export const deleteVehicleImage = async (imageId: string) => {
  try {
    await axiosInstance.delete(`/vehicle-image/${imageId}`);
  } catch (err) {
    throw err;
  }
};

export const sendPdfEstimate = async (
  values: SendEstimate,
) => {
  try {
    await axiosInstance.post(
      `/send-estimate`,
      values,
    );
    ;
  } catch (err) {
    throw err;
  }
};

export const saveEstimageImage = async (
  estimateId: string,
  formData: {
    image: Blob;
  },
) => {
  try {
    await axiosInstance.post(
      `/estimate-image/${estimateId}`,
      formData,
    );
  } catch (err) {
    throw err;
  }
};


export const downloadEstimate = async ({ id, estimate }: EstimateDownload) => {
  try {
    const response = await axiosInstance.post(`/pdf-estimate/${id}`,
      estimate,
      {
        responseType: 'blob',
      });

    const contentDisposition = response.headers['content-disposition'];

    const filename =
      contentDisposition?.match(/filename="?(.+?)"?$/)?.[1];
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    if (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        window.open(reader.result.toString(), '_blank')
      };
      reader.readAsDataURL(blob)
    }
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute("download", `${filename}`)
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url);

  } catch (error) {
    throw error;
  }
};