"use client"

import * as React from "react"
import {
  IconCalculator,
  IconReceipt,
  IconPackage,
  IconUsers,
  IconServicemark,
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "../team-switcher"
import { Logo } from "../logo"

const data = {
  user: {
    name: "Cashier",
    email: "cashier@store.com",
    avatar: "/avatars/cashier.jpg",
  },
  teams: [
    {
      name: "Smart Shop",
      logo: Logo,
      plan: "Cashier",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/shop-cashier",
      icon: IconCalculator,
     },
    {
      title: "Service",
      url: "/shop-cashier/service",
      icon: IconServicemark,
    },
    {
      title: "View Sales",
      url: "/shop-cashier/view-sales",
      icon: IconReceipt,
    },
    {
      title: "View Shop Items",
      url: "/shop-cashier/view-items",
      icon: IconPackage,
    },
    {
      title: "Customers",
      url: "/shop-cashier/customers",
      icon: IconUsers,
    },
  ],
}

export function ShopCashierSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
       <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}