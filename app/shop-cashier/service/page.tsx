import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { PointOfSale } from "@/components/dashboard/pos/point-of-sale"
import { ServicesPage } from "@/components/dashboard/service/service"

export default function Page() {
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
            <ServicesPage />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}