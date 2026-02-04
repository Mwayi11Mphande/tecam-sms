// app/shop-owner/settings/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Save,
  Store,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Globe,
  Mail,
  Smartphone,
  MapPin,
  DollarSign,
  Package
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-muted-foreground">
          Manage your store configuration and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="general">
            <Store className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="mr-2 h-4 w-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Globe className="mr-2 h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" placeholder="My Awesome Store" defaultValue="TechShop Pro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-email">Store Email</Label>
                  <Input id="store-email" type="email" placeholder="store@example.com" defaultValue="info@techshoppro.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-phone">Store Phone</Label>
                <Input id="store-phone" placeholder="+1 (555) 123-4567" defaultValue="+1 (555) 123-4567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-address">Store Address</Label>
                <Textarea id="store-address" placeholder="Enter your store address" rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea id="store-description" placeholder="Brief description of your store" rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your store operating hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex items-center justify-between">
                  <Label htmlFor={`hours-${day}`}>{day}</Label>
                  <div className="flex items-center gap-2">
                    <Input type="time" id={`open-${day}`} className="w-32" defaultValue="09:00" />
                    <span>to</span>
                    <Input type="time" id={`close-${day}`} className="w-32" defaultValue="18:00" />
                    <Switch id={`closed-${day}`} />
                    <Label htmlFor={`closed-${day}`}>Closed</Label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure accepted payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Credit/Debit Cards", enabled: true, description: "Accept Visa, MasterCard, American Express" },
                { name: "PayPal", enabled: true, description: "Secure PayPal payments" },
                { name: "Cash on Delivery", enabled: false, description: "Pay when you receive the order" },
                { name: "Bank Transfer", enabled: true, description: "Direct bank transfers" },
                { name: "Digital Wallets", enabled: false, description: "Apple Pay, Google Pay, etc." },
              ].map((method) => (
                <div key={method.name} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <Switch defaultChecked={method.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency & Taxes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                      <SelectItem value="aud">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="8.5" step="0.1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Standard Shipping", cost: "$4.99", delivery: "3-5 business days", enabled: true },
                { name: "Express Shipping", cost: "$9.99", delivery: "1-2 business days", enabled: true },
                { name: "Next Day Delivery", cost: "$19.99", delivery: "Next business day", enabled: false },
                { name: "Free Shipping", cost: "Free", delivery: "5-7 business days", enabled: true },
                { name: "Local Pickup", cost: "Free", delivery: "Ready in 1 hour", enabled: false },
              ].map((method) => (
                <div key={method.name} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {method.cost} • {method.delivery}
                    </p>
                  </div>
                  <Switch defaultChecked={method.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Zones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Shipping Regions</Label>
                <div className="flex flex-wrap gap-2">
                  {["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"].map((region) => (
                    <Badge key={region} variant="secondary">{region}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "New Order Notifications", description: "Get notified when a new order is placed" },
                { title: "Low Stock Alerts", description: "Receive alerts when products are running low" },
                { title: "Customer Messages", description: "Email notifications for customer inquiries" },
                { title: "Sales Reports", description: "Daily/weekly sales summary emails" },
                { title: "System Updates", description: "Important system and security updates" },
              ].map((notification) => (
                <div key={notification.title} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sms-number">Mobile Number for SMS Alerts</Label>
                <Input id="sms-number" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Urgent Order Alerts</h3>
                  <p className="text-sm text-muted-foreground">Receive SMS for urgent orders</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </Tabs>
    </div>
  )
}