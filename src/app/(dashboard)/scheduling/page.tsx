"use client";

import React, { useContext } from "react";
import EventCalendar from "@/features/scheduling/components/EventCalendar";
import { AbilityContext } from "@/lib/AbilityContext";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";

const SchedulePage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "schedulings")) {
    return <RestrictedAccessScreen />;
  }

  return <EventCalendar />;
};

export default SchedulePage;
