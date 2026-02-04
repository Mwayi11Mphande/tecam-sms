// components/site-header.tsx
"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChevronRight, Home, ShoppingCart, Bell, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./themes/themes-toggle"

export function SiteHeader() {
  const pathname = usePathname()
  
  // Generate breadcrumbs from the pathname
  const generateBreadcrumbs = () => {
    if (!pathname) return []
    
    const paths = pathname.split('/').filter(path => path !== '')
    
    const breadcrumbs = paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/')
      
      // Custom names for specific routes
      let name = path.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
      
      // Special cases for shop cashier routes
      if (path === 'shop-cashier') {
        name = 'Point of Sale'
      } else if (path === 'transactions') {
        name = 'View-Sales'
      } else if (path === 'products') {
        name = 'Products'
      } else if (path === 'customers') {
        name = 'Customers'
      } else if (path === 'reports') {
        name = 'Reports'
      }
      
      return {
        href,
        name: name,
        isLast: index === paths.length - 1
      }
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Check if we're in the shop-cashier section
  const isShopCashier = pathname?.includes('shop-cashier')

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm">
          {/* Home link */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
          
          {breadcrumbs.length > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          
          {/* Shop Cashier Icon */}
          {isShopCashier && breadcrumbs.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/shop-cashier">
                  <ShoppingCart className="h-4 w-4" />
                </Link>
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </>
          )}
          
          {/* Dynamic breadcrumbs */}
          {breadcrumbs.map((breadcrumb, index) => {
            // Skip the first breadcrumb if we're showing the shop icon
            if (isShopCashier && index === 0) return null
            
            return (
              <div key={breadcrumb.href} className="flex items-center">
                {breadcrumb.isLast ? (
                  <span className="font-medium text-foreground">
                    {breadcrumb.name}
                  </span>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      asChild
                    >
                      <Link href={breadcrumb.href}>
                        {breadcrumb.name}
                      </Link>
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </div>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg hover:bg-accent"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg hover:bg-accent"
          >
            <User className="h-4 w-4" />
            <span className="sr-only">User profile</span>
          </Button>
        </div>
      </div>
    </header>
  )
}