"use client";

import React, { useContext } from "react";

import HomeDesktopView from "@/features/home/components/HomeDesktopView";
import HomeMobileView from "@/features/home/components/HomeMobileView";
import { AbilityContext } from "@/lib/AbilityContext";
import RestrictedAccessScreen from "@/components/RestrictedAccessScreen";

const HomePage = () => {
  return (
    <>
      <HomeMobileView />

      <HomeDesktopView />
    </>
  );
};

export default HomePage;
