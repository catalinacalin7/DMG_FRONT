export interface CompanyFormData {
  name: string;
  website: string;
  email: string;
  phone: string;
  fax: string;
  tradeRegister: string;
  taxIdentificationNumber: string;
  taxVAT: string;
  shareCapital: number;
  vatRate: number;
  currencyCode: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}
export interface CompanyPaymentData {
  id?: string;
  iban: string;
  bic: string;
  bankName: string;
}

export interface DeleteAccountData {
  password: string;
}

export interface CompanyData extends CompanyFormData {
  id: number;
  userId: string;
}

export type MemberRoles = "TECHNICIAN" | "SALES_MANAGER" | "MANAGER";

export interface CreateMember {
  name: string;
  email: string;
  password: string;
  role: MemberRoles;
  companyName: string;
  nin: string;
  aOne: string;
  taxID: string;
  iban: string
  bic: string;
  bankName: string;
  dateOfBirth: Date;
  phone: string;
  address: string;
  salaryPercentage?: number;
  salaryFixed?: number;
}

export interface UpdateMemberDto {
  name?: string;
  email?: string;
  companyName: string;
  taxID: string;
  iban: string
  bic: string;
  bankName: string;
  nin: string;
  aOne: string;
  dateOfBirth: Date;
  phone: string;
  address: string;
  salaryPercentage?: number;
  salaryFixed?: number;
  role: MemberRoles;
}

export interface MemberDto {
  id: number;
  adminId: string;
  companyName: string;
  nin: string;
  aOne: string;
  taxID: string;
  iban: string
  bic: string;
  bankName: string;
  dateOfBirth: Date;
  phone: string;
  address: string;
  salaryPercentage?: number;
  salaryFixed?: number;
  idImage?: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: MemberRoles;
  };
}
