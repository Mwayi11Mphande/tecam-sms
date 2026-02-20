// app/dev-dash/shops/create/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  IconArrowLeft,
  IconBuildingStore,
  IconUser,
  IconMail,
  IconPhone,
  IconCreditCard
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

export default function CreateShopPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    address: "",
    city: "",
    country: "",
    plan: "",
    paymentMethod: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Validate required fields
      if (!formData.shopName || !formData.ownerName || !formData.ownerEmail || !formData.plan) {
        alert("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      // API call to create shop
      console.log("Creating shop with data:", formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to shops list
      router.push("/dev-dash/shops")
    } catch (error) {
      console.error("Error creating shop:", error)
      alert("Failed to create shop. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dev-dash/shops">
            <IconArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Shop</h1>
          <p className="text-muted-foreground">Add a new shop to the platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Shop Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBuildingStore className="h-5 w-5" />
                Shop Information
              </CardTitle>
              <CardDescription>
                Enter the basic information about the shop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="shopName" className="text-sm font-medium">
                  Shop Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="shopName"
                  name="shopName"
                  placeholder="Enter shop name"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Street Address
                </label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter street address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">
                    Country
                  </label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                Owner Information
              </CardTitle>
              <CardDescription>
                Details of the shop owner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="ownerName" className="text-sm font-medium">
                  Owner Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  placeholder="Enter owner's full name"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="ownerEmail" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="ownerEmail"
                    name="ownerEmail"
                    type="email"
                    placeholder="owner@email.com"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="ownerPhone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="ownerPhone"
                    name="ownerPhone"
                    placeholder="+1 234 567 890"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Payment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCreditCard className="h-5 w-5" />
                Subscription & Payment
              </CardTitle>
              <CardDescription>
                Select subscription plan and payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="plan" className="text-sm font-medium">
                  Subscription Plan <span className="text-red-500">*</span>
                </label>
                <Select 
                  onValueChange={(value) => handleSelectChange("plan", value)}
                  value={formData.plan}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic - $99/month</SelectItem>
                    <SelectItem value="professional">Professional - $149/month</SelectItem>
                    <SelectItem value="premium">Premium - $299/month</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  The plan determines features and limitations
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="paymentMethod" className="text-sm font-medium">
                  Payment Method
                </label>
                <Select 
                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                  value={formData.paymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dev-dash/shops">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Shop"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}