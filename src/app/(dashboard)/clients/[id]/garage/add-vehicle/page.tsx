import AddVehicleForm from "@/features/client/garage/AddVehicleForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Add Vehicle",
};

const AddVehiclePage = () => {
  return <AddVehicleForm />;
};

export default AddVehiclePage;
