// app/shop-owner/shop-items/components/AddProductModal.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  X,
  Save,
  Hash,
  Tag,
  DollarSign,
  Layers,
  Package,
  Weight,
  Ruler,
  Barcode,
  Building,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react"

export interface ProductFormData {
  name: string
  sku: string
  category: string
  price: string
  cost: string
  stock: string
  description: string
  supplier: string
  barcode: string
  weight: string
  dimensions: string
  status: string
  isActive: boolean
}

export interface ProductSubmitData {
  name: string
  sku: string
  category: string
  price: string
  cost: string
  stock: number
  description: string
  supplier: string
  barcode: string
  weight: string
  dimensions: string
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProduct: (product: ProductSubmitData) => void
}

export function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
    description: "",
    supplier: "",
    barcode: "",
    weight: "",
    dimensions: "",
    status: "In Stock",
    isActive: true
  })

  const [activeTab, setActiveTab] = useState("basic")

  const categories = [
    "Electronics",
    "Accessories",
    "Home & Kitchen",
    "Stationery",
    "Clothing",
    "Food & Beverages",
    "Health & Beauty",
    "Sports & Outdoors",
    "Toys & Games",
    "Books",
    "Automotive",
    "Garden"
  ]

  const suppliers = [
    "TechCorp Inc.",
    "Global Accessories",
    "Home Essentials Co.",
    "Office Supplies Ltd.",
    "Fashion Trends",
    "Food Distributors Inc.",
    "Beauty World",
    "Sports Gear Co."
  ]

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateSKU = () => {
    if (!formData.name) {
      alert("Please enter product name first")
      return
    }
    
    const prefix = formData.name.substring(0, 2).toUpperCase()
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const sku = `${prefix}-${randomNum}`
    handleInputChange("sku", sku)
  }

  const calculateProfit = () => {
    const price = parseFloat(formData.price) || 0
    const cost = parseFloat(formData.cost) || 0
    if (cost > 0 && price > 0) {
      const profit = ((price - cost) / cost) * 100
      return isNaN(profit) ? 0 : profit.toFixed(1)
    }
    return 0
  }

  const calculateProfitAmount = () => {
    const price = parseFloat(formData.price) || 0
    const cost = parseFloat(formData.cost) || 0
    return (price - cost).toFixed(2)
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      alert("Product name is required")
      return
    }
    if (!formData.sku.trim()) {
      alert("SKU is required")
      return
    }
    if (!formData.category) {
      alert("Category is required")
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert("Valid price is required")
      return
    }
    if (!formData.cost || parseFloat(formData.cost) < 0) {
      alert("Valid cost is required")
      return
    }

    // Prepare product data
    const productData: ProductSubmitData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: formData.price,
      cost: formData.cost,
      stock: parseInt(formData.stock) || 0,
      description: formData.description,
      supplier: formData.supplier,
      barcode: formData.barcode,
      weight: formData.weight,
      dimensions: formData.dimensions
    }

    onAddProduct(productData)
    
    // Reset form
    setFormData({
      name: "",
      sku: "",
      category: "",
      price: "",
      cost: "",
      stock: "",
      description: "",
      supplier: "",
      barcode: "",
      weight: "",
      dimensions: "",
      status: "In Stock",
      isActive: true
    })
    
    setActiveTab("basic")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Product
          </DialogTitle>
          <DialogDescription>
            Add a new product to your inventory. Fill in the required details below.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    SKU *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="sku"
                      placeholder="PROD-001"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateSKU}
                      size="sm"
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the product features, specifications, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Selling Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-500" />
                    Cost Price *
                  </Label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.cost}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {(formData.price || formData.cost) && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Profit Margin</p>
                    <p className="text-lg font-semibold text-green-600">
                      {calculateProfit()}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit per Unit</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${calculateProfitAmount()}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Initial Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="text-base">
                    Product Active
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Product will be visible to customers
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="supplier" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Supplier
                </Label>
                <Select
                  value={formData.supplier}
                  onValueChange={(value) => handleInputChange("supplier", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="barcode" className="flex items-center gap-2">
                    <Barcode className="h-4 w-4" />
                    Barcode
                  </Label>
                  <Input
                    id="barcode"
                    placeholder="Enter barcode number"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange("barcode", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.001"
                    placeholder="0.000"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions" className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Dimensions (L × W × H)
                </Label>
                <Input
                  id="dimensions"
                  placeholder="e.g., 10 × 5 × 3 cm"
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange("dimensions", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Product Images
                </Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop images here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 800×800px, max 5MB each
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          {activeTab !== "basic" && (
            <Button
              variant="secondary"
              onClick={() => {
                if (activeTab === "pricing") setActiveTab("basic")
                if (activeTab === "advanced") setActiveTab("pricing")
              }}
            >
              Back
            </Button>
          )}
          {activeTab !== "advanced" ? (
            <Button
              onClick={() => {
                if (activeTab === "basic") setActiveTab("pricing")
                if (activeTab === "pricing") setActiveTab("advanced")
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2"
              disabled={!formData.name || !formData.sku || !formData.category || !formData.price || !formData.cost}
            >
              <Save className="h-4 w-4" />
              Add Product
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}