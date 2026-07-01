"use client";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";
import EstimatesList from "@/features/estimates/EstimatesList";
import { AbilityContext } from "@/lib/AbilityContext";
import { useContext } from "react";

const EstimatePage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "estimates")) {
    return <RestrictedAccessScreen />;
  }
  return (
    <>
      <EstimatesList />{" "}
    </>
  );
};

export default EstimatePage;
