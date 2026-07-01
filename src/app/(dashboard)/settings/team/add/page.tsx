import AddTeamMemberForm from "@/features/settings/team/AddTeamMemberForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Add Team Member",
};

const AddMemberPage = () => {
  return <AddTeamMemberForm />;
};

export default AddMemberPage;
