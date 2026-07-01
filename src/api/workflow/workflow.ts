import { ClientType, CompanyMember, VehicleType } from "@/types/schedule";
import axiosInstance from "../axiosInstance";

export type WorkflowItem = {
  id: string;
  date: Date;
  time: string;
  clientId: string;
  eventLocation: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  vehicleId: string;
  serviceName: string;
  assigneeName: string;
  status: string;
  client: ClientType;
  vehicle: VehicleType;
  companyMember: CompanyMember;
};

export enum WorkflowStatus {
  new = "new",
  inProgress = "in_progress",
  completed = "completed"
}



export const getWorkflows = async (clientName?: string | null, companyMember?: string | null, searchQuery?: string | null) => {
  try {
    const { data } = await axiosInstance.get(`/workflows`,
      {
        params: {
          clientName: clientName,
          companyMember: companyMember,
          searchQuery: searchQuery
        },
      }
    );
    return data as WorkflowItem[]
  } catch (err) {
    throw err;
  }
};

export const updateWorkflowStatus = async (status: WorkflowStatus, id: string) => {
  try {
    const { data } = await axiosInstance.patch(`/workflows/${id}`, { status },);
    return data as WorkflowItem;
  } catch (err) {
    throw err;
  }
};