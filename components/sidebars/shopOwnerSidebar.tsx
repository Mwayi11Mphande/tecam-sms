"use client"

import * as React from "react"
import {
  IconDashboard,
  IconBuildingStore,
  IconUsers,
  IconPackage,
  IconReceipt,
  IconChartBar,
  IconCash,
  IconSettings,
  IconHelp,
  IconSearch,
  IconReport,
  IconDatabase,
  IconInnerShadowTop,
  IconTrendingUp,
  IconShield,
  IconCalendar,
  IconMoneybag,
  IconListDetails,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Shop Owner",
    email: "owner@store.com",
    avatar: "/avatars/owner.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/shop-owner",
      icon: IconDashboard,
    },
    {
      title: "Sales Management",
      url: "/shop-owner/view-sales",
      icon: IconBuildingStore,
    },
    {
      title: "View Shop Items",
      url: "/shop-owner/shop-items",
      icon: IconPackage,
    },
    {
      title: "Shop Stock",
      url: "/shop-owner/shop-stock",
      icon: IconReceipt,
    },
    {
      title: "Sales & Revenue",
      url: "/shop-owner/shop-reports",
      icon: IconTrendingUp,
    },
    {
      title: "Service Management",
      url: "/shop-owner/view-service",
      icon: IconListDetails,
    },
     {
      title: "Staff Management",
      url: "/shop-owner/staff-manage",
      icon: IconUsers,
    },
    {
      title: "Store Settings",
      icon: IconSettings,
      url: "/shop-owner/settings",
    },
  ],
  
}

export function ShopOwnerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/shop-owner">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Business Hub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}