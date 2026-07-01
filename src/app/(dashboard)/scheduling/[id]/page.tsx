import React from "react";
import SchedulingsEvent from "@/features/scheduling/components/SchedulingsEvent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View event",
};

const SchedulingEventPage = () => {
  return <SchedulingsEvent />;
};

export default SchedulingEventPage;
