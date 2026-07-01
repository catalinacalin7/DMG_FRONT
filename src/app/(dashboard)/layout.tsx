"use client";

import MobileLayout from "@/features/layouts/MobileLayout";
import DesktopLayout from "@/features/layouts/DesktopLayout";
import { AbilityProvider } from "@/components/AbilityProvider";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AbilityProvider>
        <MobileLayout>{children}</MobileLayout>
        <DesktopLayout>{children}</DesktopLayout>
      </AbilityProvider>
    </>
  );
};

export default HomeLayout;
