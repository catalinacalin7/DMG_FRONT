"use client";

import Clients from "@/features/clients/Clients";
import React from "react";
import { useContext } from "react";
import { AbilityContext } from "@/lib/AbilityContext";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";

const ClientsPage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "clients")) {
    return <RestrictedAccessScreen />;
  }
  return <Clients />;
};

export default ClientsPage;
