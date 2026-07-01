"use client";
import { Metadata } from "next";
import React from "react";

import { useQuery } from "@tanstack/react-query";

import { useParams } from "next/navigation";

import { getClientById } from "@/api/client/get-by-id";
import LoadingScreen from "@/components/LoadingScreen";
import { BusinessClientData, PrivateClientData } from "@/types/clients";

import BusinessForm from "../ClientForms/BusinessForm";
import PrivateForm from "../ClientForms/PrivateForm";

export const metadata: Metadata = {
  title: "Info",
};

const ClientInfo = () => {
  const { id } = useParams();

  const { data: clientData, isLoading: isLoadingClientData } = useQuery({
    queryKey: ["client", id],
    queryFn: () => getClientById(id as string),
    enabled: !!id,
  });

  if (isLoadingClientData) return <LoadingScreen />;

  return clientData?.clientType === "BUSINESS" ? (
    <BusinessForm clientData={clientData as BusinessClientData} />
  ) : (
    <PrivateForm clientData={clientData as PrivateClientData} />
  );
};

export default ClientInfo;
