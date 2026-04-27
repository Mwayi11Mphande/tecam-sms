'use client'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { PointOfSale } from "@/components/dashboard/pos/point-of-sale"
import { useShopStore } from "@/stores/shop/shopStore";
import { useEffect } from "react";

export default function Page() {
  const fetchShop = useShopStore((s) => s.fetchShop);

  useEffect(() => {
    fetchShop();
  }, []);
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <PointOfSale />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}