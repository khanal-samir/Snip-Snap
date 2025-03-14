import { AppSidebar } from "@/components/common/app-sidebar";
import { TopNav } from "@/components/common/top-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function page() {
  return (
    <div>
      {" "}
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-col w-full">
            <TopNav />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
