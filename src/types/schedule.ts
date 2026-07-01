export type CreateScheduleEvent = {
  id?: string;
  date: Date;
  time: string;
  clientId: string;
  eventLocation: string;
  vehicleId: string;
  serviceName: string;
  assigneeName: string;
  status: string;
};

export type ScheduleEventResponse = {
  id?: string;
  date: Date;
  time: string;
  clientId: string;
  eventLocation: string;
  userId: string;
  vehicleId: string;
  serviceName: number;
  assigneeName: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ScheduleEvent = {
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

export type VehicleType = {
  vehicleType: string;
  vinNumber: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  doors: string;
  createdAt: Date;
  updatedAt: Date;
  odometer: "120000 km";
  fuel: string;
  vehicleImages: {
    id: number;
    url: URL;
  };
};

export type ClientType = {
  id: string;
  name: string;
  address: string;
  country: string;
  city: string;
  zipCode: string;
  taxID: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
  clientType: "BUSINESS" | "PRIVATE";
  avatar: string;
  url: URL | null;
};

export type CompanyMember = {
  id: number;
  adminId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "TECHNICIAN" | "ADMIN";
  };
};
