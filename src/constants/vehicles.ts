import {
  Calendar,
  CarFront,
  Component,
  Container,
  DoorOpen,
  FileDigit,
  Fuel,
  Gauge,
  Type,
} from "lucide-react";

import { BusinessFormField } from "../types/vehicles";
import { generateYearOptions } from "../utils/generateYearOptions";

export const BUSINESS_FORM_FIELDS: BusinessFormField[] = [
  {
    title: "Vehicle Type",
    name: "vehicleType",
    input: "select",
    icon: Type,
    options: [
      { label: "Sedan", value: "sedan" },
      { label: "Hatchback", value: "hatchback" },
      { label: "SUV", value: "suv" },
      { label: "Coupe", value: "coupe" },
      { label: "Convertible", value: "convertible" },
      { label: "Pickup Truck", value: "pickup_truck" },
      { label: "Van", value: "van" },
      { label: "Wagon", value: "wagon" },
      { label: "Minivan", value: "minivan" },
      { label: "Crossover", value: "crossover" },
      { label: "Motorcycle", value: "motorcycle" },
    ],
  },
  {
    title: "VIN Number",
    name: "vinNumber",
    input: "text",
    icon: FileDigit,
  },
  {
    title: "Make",
    name: "make",
    input: "drawer-select",
    icon: CarFront,
  },
  {
    title: "Model",
    name: "model",
    input: "drawer-select",
    icon: Component,
  },
  {
    title: "Year",
    name: "year",
    input: "select",
    options: generateYearOptions(1980),
    icon: Calendar,
  },
  {
    title: "Engine",
    name: "engine",
    input: "numeric-format",
    suffix: " cm3",
    icon: Container,
  },
  {
    title: "Doors",
    name: "doors",
    input: "select",
    icon: DoorOpen,
    options: [
      { label: "2 Doors", value: "2" },
      { label: "3 Doors", value: "3" },
      { label: "4 Doors", value: "4" },
      { label: "5 Doors", value: "5" },
    ],
  },
  {
    title: "Odometer",
    name: "odometer",
    input: "numeric-format",
    suffix: " km",
    icon: Gauge,
  },
  {
    title: "Fuel",
    name: "fuel",
    input: "select",
    icon: Fuel,
    options: [
      { label: "Petrol", value: "petrol" },
      { label: "Diesel", value: "diesel" },
      { label: "Electric", value: "electric" },
      { label: "Hybrid", value: "hybrid" },
      { label: "CNG", value: "cng" },
      { label: "LPG", value: "lpg" },
      { label: "Hydrogen", value: "hydrogen" },
    ],
  },
];
