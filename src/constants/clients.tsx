import {
  Building2,
  Earth,
  MapPinHouse,
  SquarePercent,
  User,
} from "lucide-react";
import { HTMLAttributes } from "react";
import * as yup from "yup";

import { BusinessClientData, PrivateClientData } from "../types/clients";

export const BUSINESS_CLIENT_FORM_FIELDS = [
  {
    title: "Company Name",
    name: "name",
    input: "text",
    icon: User,
  },
  {
    title: "Address",
    name: "address",
    input: "text",
    icon: MapPinHouse,
  },
  {
    title: "Country",
    name: "country",
    input: "select",
    icon: Earth,
  },
  {
    title: "City",
    name: "city",
    input: "text",
    icon: Building2,
  },
  {
    title: "Zip Code",
    name: "zipCode",
    input: "text",
    icon: (props: HTMLAttributes<HTMLDivElement>) => (
      <div className="text-xs text-blue-600" {...props}>
        ZIP
      </div>
    ),
  },
  {
    title: "Tax ID",
    name: "taxID",
    input: "text",
    icon: SquarePercent,
  },
] as const;

export const BUSINESS_CLIENT_SCHEMA = yup.object().shape({
  name: yup.string().required(),
  tradeRegister: yup.string().optional(),
  address: yup.string().optional(),
  city: yup.string().required(),
  country: yup.string().required(),
  vatRate: yup
    .number()
    .integer("Number 1 to 100")
    .min(0, "Min 1")
    .max(100, "Max 100")
    .required(),
  clientDiscount: yup
    .number()
    .integer("Number 1 to 100")
    .min(0, "Min 0")
    .max(100, "Max 100")
    .optional()
    .typeError("Number from 1-100"),
  notes: yup.string().optional(),
  taxID: yup.string().optional(),
  vatID: yup.string().optional(),
  zipCode: yup.string().optional(),
});

export const BUSINESS_CLIENT_FORM_DEFAULT_VALUES: BusinessClientData = {
  name: "",
  tradeRegister: "",
  address: "",
  country: "",
  city: "",
  zipCode: "",
  taxID: "",
  vatID: "",
  vatRate: 0,
  clientDiscount: 0,
  notes: "",
};

export const PRIVATE_CLIENT_FORM_FIELDS = [
  {
    title: "Name",
    name: "name",
    input: "text",
    icon: User,
  },
  {
    title: "Address",
    name: "address",
    input: "text",
    icon: MapPinHouse,
  },
  {
    title: "Country",
    name: "country",
    input: "select",
    icon: Earth,
  },
  {
    title: "City",
    name: "city",
    input: "text",
    icon: Building2,
  },
] as const;

export const PRIVATE_CLIENT_SCHEMA = yup.object().shape({
  avatar: yup.string(),
  name: yup.string().required(),
  address: yup.string().optional(),
  vatRate: yup
    .number()
    .integer("Number 0 to 100")
    .min(0, "Min 1")
    .max(100, "Max 100")
    .required(),
  country: yup.string().optional(),
  city: yup.string().optional(),
  notes: yup.string().optional(),
});

export const PRIVATE_CLIENT_FORM_DEFAULT_VALUES: PrivateClientData = {
  name: "",
  address: "",
  vatRate: 0,
  country: "",
  city: "",
  notes: "",
};
