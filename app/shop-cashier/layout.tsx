import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ShopCashierSidebar } from "@/components/sidebars/shopCashierSidebar";
import { SiteHeader } from "@/components/site-header"; // Import the SiteHeader
import { Toaster } from "@/components/ui/sonner";

export default function ShopCashierLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <ShopCashierSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader /> {/* Use the SiteHeader component */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        <Toaster position="top-right" richColors expand={true} closeButton/>
      </SidebarInset>
    </SidebarProvider>
  );
}