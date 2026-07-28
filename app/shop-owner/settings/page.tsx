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
import { formatMK } from "@/lib/currency"

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
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Store className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No business hours configured yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add your operating days and hours</p>
              </div>
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
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No payment methods configured yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add payment methods your customers can use</p>
              </div>
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
                  <Select defaultValue="mk">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mk">MK (Malawian Kwacha)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="0" step="0.1" />
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
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No shipping methods configured yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add shipping options for your customers</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No shipping zones configured yet</p>
                <p className="text-xs text-muted-foreground mt-1">Define regions you ship to</p>
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
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No email notification preferences configured yet</p>
                <p className="text-xs text-muted-foreground mt-1">Configure which email alerts you receive</p>
              </div>
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

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">Security settings will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Advanced configuration options for your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">Advanced settings will be available soon</p>
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
