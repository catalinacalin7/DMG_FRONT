import { TypeIcon } from "lucide-react";

export type BusinessFormField = {
  title: string;
  name:
    | "vehicleType"
    | "vinNumber"
    | "make"
    | "model"
    | "year"
    | "engine"
    | "doors"
    | "odometer"
    | "fuel";
  input: "select" | "drawer-select" | "text" | "numeric-format";
  icon: typeof TypeIcon;
  suffix?: string;
  options?: { label: string; value: string }[];
};
