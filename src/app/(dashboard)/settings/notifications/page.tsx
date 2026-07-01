"use client";

import Notifications from "@/features/settings/notifications/Notifications";
import { AbilityContext } from "@/lib/AbilityContext";
import { useContext } from "react";

const NotificationsPage = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "notifications")) {
    return <div>You don&apos;t have permission to view team members</div>;
  }
  return <Notifications />;
};
export default NotificationsPage;
