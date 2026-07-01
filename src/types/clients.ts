export interface BusinessClientData {
  id?: string;
  name: string;
  tradeRegister: string;
  address: string;
  country: string;
  city: string;
  zipCode: string;
  taxID: string;
  vatID: string;
  vatRate: number;
  clientDiscount?: number;
  notes: string;
  url?: string;
  clientType?: "BUSINESS" | "PRIVATE";
}

export interface PrivateClientData {
  id?: string;
  name: string;
  address: string;
  country: string;
  city: string;
  notes: string;
  vatRate: number;
  url?: string;
  clientType?: "PRIVATE";
  clientDiscount?: number;
}

export interface ClientContactData {
  clientId: string;
  id?: number;
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
}
