"use client";

import React, { useContext } from "react";

import AnalyticsDesktop from "./AnalyticsDesktop";
import EarningsDesktop from "./EarningsDesktop";
import NotificationsDesktop from "./NotificationsDesktop";
import StatsDesktop from "./StatsDesktop";
import InvoicesDesktop from "./InvoicesDesktop";
import { AbilityContext } from "@/lib/AbilityContext";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";

const HomeDesktopView = () => {
  const ability = useContext(AbilityContext);

  if (!ability.can("manage", "dashboard")) {
    return (
      <div className="hidden xl:grid">
        <RestrictedAccessScreen />
      </div>
    );
  }
  return (
    <section className="hidden grid-cols-[1fr_0.4fr] gap-8 xl:grid">
      <div className="flex flex-col gap-8">
        <StatsDesktop />

        <div className="grid grid-cols-[1fr_minmax(0,256px)] gap-8">
          <AnalyticsDesktop />

          <EarningsDesktop />
        </div>

        <InvoicesDesktop />
      </div>

      <NotificationsDesktop />
    </section>
  );
};

export default HomeDesktopView;
