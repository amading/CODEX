import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export function AppLayout() {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={{ "--sidebar-width-icon": "5rem" } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="min-h-svh min-w-0 overflow-hidden md:min-h-screen">
        <AppHeader />
        <main className="flex flex-1 min-h-0 min-w-0 flex-col overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
