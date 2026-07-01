"use client";

import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";
import WorkflowDesktop from "@/features/workflow/WorkflowDesktop";
import { AbilityContext } from "@/lib/AbilityContext";
import React, { useContext } from "react";

const WorkflowPage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "workflow")) {
    return <RestrictedAccessScreen />;
  }
  return (
    <>
      <WorkflowDesktop />
    </>
  );
};

export default WorkflowPage;
