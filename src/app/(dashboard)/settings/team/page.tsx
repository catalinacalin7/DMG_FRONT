"use client";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";
import TeamMembersList from "@/features/settings/team/TeamMembersList";
import { AbilityContext } from "@/lib/AbilityContext";
import { useTranslations } from "next-intl";
import React, { useContext } from "react";

const EditMemberPage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "team")) {
    return <RestrictedAccessScreen />;
  }
  return (
    <div className="pt-6">
      <TeamMembersList />
    </div>
  );
};

export default EditMemberPage;
