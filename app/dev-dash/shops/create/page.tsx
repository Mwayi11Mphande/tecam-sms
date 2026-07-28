"use client"

import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { shopService } from "@/lib/services/shop.service"
import { userService } from "@/lib/services/user.service"

export default function CreateShopPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [owners, setOwners] = useState<any[]>([])
  const [loadingOwners, setLoadingOwners] = useState(true)
  const [ownerMode, setOwnerMode] = useState<"select" | "create">("select")
  const [formData, setFormData] = useState({
    shopName: "",
    ownerId: "",
    phone: "",
    email: "",
    address: "",
    plan: "",
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  })

  useEffect(() => {
    userService.getAll()
      .then(res => {
        const users = res.data || []
        setOwners(users.filter((u: any) => u.role === "OWNER"))
      })
      .catch(console.error)
      .finally(() => setLoadingOwners(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.shopName) {
        alert("Shop name is required")
        setIsLoading(false)
        return
      }

      if (ownerMode === "select" && !formData.ownerId) {
        alert("Please select an owner")
        setIsLoading(false)
        return
      }

      const baseData = {
        name: formData.shopName,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
        plan: formData.plan || undefined,
      }

      if (ownerMode === "create") {
        if (!formData.ownerName || !formData.ownerEmail || !formData.ownerPassword) {
          alert("Owner name, email, and password are required")
          setIsLoading(false)
          return
        }
        await shopService.create({
          ...baseData,
          ownerData: {
            fullName: formData.ownerName,
            email: formData.ownerEmail,
            password: formData.ownerPassword,
          },
        })
      } else {
        await shopService.create({
          ...baseData,
          ownerId: formData.ownerId,
        })
      }
      
      router.push("/dev-dash/shops")
    } catch (err: any) {
      alert(err.message || "Failed to create shop")
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBuildingStore className="h-5 w-5" />
                Shop Information
              </CardTitle>
              <CardDescription>Enter the basic information about the shop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name <span className="text-red-500">*</span></Label>
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
                <Label htmlFor="address">Street Address</Label>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="shop@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                Shop Owner
              </CardTitle>
              <CardDescription>Select an existing owner or create a new one</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={ownerMode === "select" ? "default" : "outline"}
                  onClick={() => setOwnerMode("select")}
                >
                  Select Existing Owner
                </Button>
                <Button
                  type="button"
                  variant={ownerMode === "create" ? "default" : "outline"}
                  onClick={() => setOwnerMode("create")}
                >
                  Create New Owner
                </Button>
              </div>

              {ownerMode === "select" ? (
                <div className="space-y-2">
                  <Label htmlFor="ownerId">Owner <span className="text-red-500">*</span></Label>
                  {loadingOwners ? (
                    <div className="text-sm text-muted-foreground">Loading owners...</div>
                  ) : (
                    <Select
                      value={formData.ownerId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, ownerId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {owners.map((owner) => (
                          <SelectItem key={owner.id} value={owner.id}>
                            {owner.fullName} ({owner.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Full Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      placeholder="Enter owner full name"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Email <span className="text-red-500">*</span></Label>
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
                    <Label htmlFor="ownerPassword">Password <span className="text-red-500">*</span></Label>
                    <Input
                      id="ownerPassword"
                      name="ownerPassword"
                      type="password"
                      placeholder="Set a temporary password"
                      value={formData.ownerPassword}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      The owner can change this password after logging in.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCreditCard className="h-5 w-5" />
                Subscription Plan
              </CardTitle>
              <CardDescription>Select initial subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, plan: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="BASIC">Basic - $99/month</SelectItem>
                    <SelectItem value="PRO">Professional - $149/month</SelectItem>
                    <SelectItem value="ENTERPRISE">Premium - $299/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

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