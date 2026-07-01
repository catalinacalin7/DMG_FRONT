import EditTeamMemberForm from "@/features/settings/team/EditTeamMemberForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Team Member",
};

const EditUserPage = () => {
  return <EditTeamMemberForm />;
};

export default EditUserPage;
