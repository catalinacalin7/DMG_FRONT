"use client";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";
import AddOnsForm from "@/features/settings/addons/AddOnsForm";
import { AbilityContext } from "@/lib/AbilityContext";
import { useContext } from "react";

function AddOns() {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "add-ons")) {
    return <RestrictedAccessScreen />;
  }
  return (
    <div className="space-y-0 py-6">
      <AddOnsForm />
    </div>
  );
}
export default AddOns;
