import { Metadata } from "next";
import React from "react";

import MobileNotifications from "@/features/home/components/MobileNotifications";

export const metadata: Metadata = {
  title: "Notifications",
};

const NotificationsPage = () => {
  return <MobileNotifications />;
};

export default NotificationsPage;
