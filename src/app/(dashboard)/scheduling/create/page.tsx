import React from "react";

import SchedulingEventForm from "@/features/scheduling/components/SchedulingEventForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create event",
};

const CreateSchedulePage = () => {
  return <SchedulingEventForm />;
};

export default CreateSchedulePage;
