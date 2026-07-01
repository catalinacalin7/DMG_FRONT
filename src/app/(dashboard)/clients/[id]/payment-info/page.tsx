"use client";

import React, { useContext } from "react";
import PaymentInfoForm from "@/features/client/payment/PaymentInfoForm";

import { AbilityContext } from "@/lib/AbilityContext";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";

const PaymentPage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "client-payments")) {
    return <RestrictedAccessScreen />;
  }
  return <PaymentInfoForm />;
};

export default PaymentPage;
