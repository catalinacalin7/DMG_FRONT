import { Metadata } from "next";
import React from "react";

import AddClient from "@/features/client/AddClient";

export const metadata: Metadata = {
  title: "New Client",
};

const AddClientPage = () => {
  return <AddClient />;
};

export default AddClientPage;
