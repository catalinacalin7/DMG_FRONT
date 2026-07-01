"use client";

import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";
import AccountPreference from "@/features/settings/account-preference/AccountPreference";
import { AbilityContext } from "@/lib/AbilityContext";
import { useContext } from "react";

const AccountPreferencePage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "permissions")) {
    return <RestrictedAccessScreen />;
  }
  return <AccountPreference />;
};
export default AccountPreferencePage;
