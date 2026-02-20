// components/sidebars/devDashSidebar.tsx
"use client"

import * as React from "react"
import {
  IconDashboard,
  IconBuildingStore,
  IconUsers,
  IconCoin,
  IconReceipt,
  IconChartBar,
  IconCash,
  IconSettings,
  IconHelp,
  IconReport,
  IconDatabase,
  IconInnerShadowTop,
  IconShield,
  IconCalendarDue,
  IconCurrencyDollar,
  IconMail,
  IconBell,
  IconLogout,
  IconCreditCard,
  IconHistory,
  IconUserPlus,
  IconBuildingBank,
} from "@tabler/icons-react"

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
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "System Admin",
    email: "admin@system.com",
    avatar: "/avatars/admin.jpg",
    role: "Super Admin"
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dev-dash",
      icon: IconDashboard,
      isActive: true,
    },
    {
      title: "Shop Management",
      url: "/dev-dash/shops",
      icon: IconBuildingStore,
      items: [
        {
          title: "All Shops",
          url: "/dev-dash/shops",
          icon: IconBuildingStore,
        },
        {
          title: "Create New Shop",
          url: "/dev-dash/shops/create",
          icon: IconUserPlus,
        },
        {
          title: "Pending Approvals",
          url: "/dev-dash/shops/pending",
          icon: IconHistory,
          badge: "3",
        },
      ],
    },
    {
      title: "Subscription Management",
      url: "/dev-dash/subscriptions",
      icon: IconCurrencyDollar,
      items: [
        {
          title: "Active Subscriptions",
          url: "/dev-dash/subscriptions/active",
          icon: IconCreditCard,
          badge: "24",
        },
        {
          title: "Payment History",
          url: "/dev-dash/subscriptions/payments",
          icon: IconReceipt,
        },
        {
          title: "Pending Payments",
          url: "/dev-dash/subscriptions/pending",
          icon: IconCalendarDue,
          badge: "5",
        },
        {
          title: "Subscription Plans",
          url: "/dev-dash/subscriptions/plans",
          icon: IconBuildingBank,
        },
      ],
    },
    {
      title: "User Management",
      url: "/dev-dash/users",
      icon: IconUsers,
      items: [
        {
          title: "All Users",
          url: "/dev-dash/users",
          icon: IconUsers,
        },
        {
          title: "Shop Owners",
          url: "/dev-dash/users/owners",
          icon: IconBuildingStore,
          badge: "28",
        },
        {
          title: "Staff Members",
          url: "/dev-dash/users/staff",
          icon: IconUsers,
          badge: "156",
        },
        {
          title: "Invitations",
          url: "/dev-dash/users/invitations",
          icon: IconMail,
        },
      ],
    },

    {
      title: "SystemSupport",
      url: "/dev-dash/sys-support",
      icon: IconHelp,
    },
    {
      title: "Financial Overview",
      url: "/dev-dash/financial",
      icon: IconCoin,
      items: [
        {
          title: "Revenue Analytics",
          url: "/dev-dash/financial/revenue",
          icon: IconChartBar,
        },
        {
          title: "Transaction History",
          url: "/dev-dash/financial/transactions",
          icon: IconHistory,
        },
        {
          title: "Payouts",
          url: "/dev-dash/financial/payouts",
          icon: IconCash,
        },
        {
          title: "Tax Reports",
          url: "/dev-dash/financial/taxes",
          icon: IconReport,
        },
      ],
    },
    {
      title: "System Reports",
      url: "/dev-dash/reports",
      icon: IconReport,
      items: [
        {
          title: "Usage Analytics",
          url: "/dev-dash/reports/usage",
          icon: IconChartBar,
        },
        {
          title: "System Health",
          url: "/dev-dash/reports/health",
          icon: IconDatabase,
        },
        {
          title: "Audit Logs",
          url: "/dev-dash/reports/audit",
          icon: IconShield,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Notifications",
      url: "/dev-dash/notifications",
      icon: IconBell,
      badge: "12",
    },
    {
      title: "Settings",
      url: "/dev-dash/settings",
      icon: IconSettings,
    },
  ],
}

export function DevDashSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dev-dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <IconShield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">System Admin</span>
                  <span className="truncate text-xs">Management Console</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarSeparator className="mx-0" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}