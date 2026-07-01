"use client";

import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";
import InvoiceSettingsForm from "@/features/settings/invoice-settings/InvoiceSettingsForm";
import { AbilityContext } from "@/lib/AbilityContext";
import { useContext } from "react";

const InvoiceSettings = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "invoices-settings")) {
    return <RestrictedAccessScreen />;
  }
  return <InvoiceSettingsForm />;
};
export default InvoiceSettings;
