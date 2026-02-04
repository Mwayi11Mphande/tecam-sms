// app/dashboard/sales/page.tsx
import { ViewSales } from "@/components/dashboard/viewSales/view-sales"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function SalesPage() {
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
          <div className="@container/main flex flex-1 flex-col gap-2">
            <ViewSales />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}