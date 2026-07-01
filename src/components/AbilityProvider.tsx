"use client";

import { AbilityContext } from "@/lib/AbilityContext";
import { defineAbilityFor } from "@/lib/ability";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const [ability, setAbility] = useState<any>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      const res = await axiosInstance.get("/permissions");
      const permissions = await res.data;
      const ability = defineAbilityFor(permissions);
      setAbility(ability);
    };

    fetchPermissions();
  }, []);

  if (!ability) return null;

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
