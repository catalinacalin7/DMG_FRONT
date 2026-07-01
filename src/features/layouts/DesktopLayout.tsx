"use client";
import { SidebarProvider } from "@/components/ui/sidebar";

import HeaderDesktop from "./components/HeaderDesktop";
import SidebarDesktop from "./components/SidebarDesktop";

const DesktopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hidden w-full xl:flex">
      <SidebarProvider>
        <SidebarDesktop />

        <div className="flex w-full flex-col">
          <HeaderDesktop />

          <section className="h-full w-full bg-[#f5f5f5] p-8 lg:rounded-tl-lg">
            <div className="rounded-none bg-white p-8 lg:rounded-lg">
              {children}
            </div>
          </section>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DesktopLayout;
