"use client";

import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";
import ClientInfo from "@/features/client/info/ClientInfo";
import { AbilityContext } from "@/lib/AbilityContext";
import React, { useContext } from "react";

const ClientInfoPage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "client-info")) {
    return <RestrictedAccessScreen />;
  }

  return <ClientInfo />;
};

export default ClientInfoPage;
