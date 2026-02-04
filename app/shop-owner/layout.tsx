import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { ShopOwnerSidebar } from "@/components/sidebars/shopOwnerSidebar";

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
      <ShopOwnerSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader /> {/* Use the SiteHeader component */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}