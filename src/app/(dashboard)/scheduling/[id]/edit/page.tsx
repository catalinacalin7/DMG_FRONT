import React from "react";
import SchedulingEventForm from "@/features/scheduling/components/SchedulingEventForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit event",
};

const EditEventPage = () => {
  return <SchedulingEventForm />;
};

export default EditEventPage;
