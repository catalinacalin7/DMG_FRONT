"use client";

import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";
import InvoicesList from "@/features/invoices/InvoicesList/InvoicesList";
import { AbilityContext } from "@/lib/AbilityContext";

import React, { useContext } from "react";

const InvoicesPage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "invoices")) {
    return <RestrictedAccessScreen />;
  }

  return (
    <>
      <InvoicesList />
    </>
  );
};

export default InvoicesPage;
