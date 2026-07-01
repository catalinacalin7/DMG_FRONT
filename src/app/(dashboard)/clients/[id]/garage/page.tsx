"use client";

import React, { useContext } from "react";
import CarsList from "@/features/client/garage/CarsList";
import { AbilityContext } from "@/lib/AbilityContext";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";

const VehiclePage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "vehicles")) {
    return <RestrictedAccessScreen />;
  }
  return <CarsList />;
};

export default VehiclePage;
