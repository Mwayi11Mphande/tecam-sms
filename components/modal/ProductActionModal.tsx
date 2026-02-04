// app/shop-owner/shop-items/components/ProductActionModal.tsx
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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  Hash,
  Tag,
  DollarSign,
  Layers,
  AlertCircle,
  Building,
  Barcode,
  Weight,
  Ruler,
  Image as ImageIcon,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Copy,
  Calendar,
  Clock,
  Users
} from "lucide-react"

export interface Product {
  id: number
  name: string
  sku: string
  category: string
  price: string
  cost: string
  stock: number
  status: string
  description?: string
  supplier?: string
  barcode?: string
  weight?: string
  dimensions?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  salesCount?: number
  profitMargin?: number
}

type ModalMode = 'view' | 'edit' | 'delete'

interface ProductActionModalProps {
  isOpen: boolean
  onClose: () => void
  mode: ModalMode
  product: Product
  onSave?: (updatedProduct: Product) => void
  onDelete?: (productId: number) => void
}

export function ProductActionModal({
  isOpen,
  onClose,
  mode,
  product,
  onSave,
  onDelete
}: ProductActionModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [editedProduct, setEditedProduct] = useState<Product>(product)
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const categories = [
    "Electronics",
    "Accessories",
    "Home & Kitchen",
    "Stationery",
    "Clothing",
    "Food & Beverages",
    "Health & Beauty",
    "Sports & Outdoors"
  ]

  const suppliers = [
    "TechCorp Inc.",
    "Global Accessories",
    "Home Essentials Co.",
    "Office Supplies Ltd.",
    "Fashion Trends"
  ]

  const handleInputChange = (field: keyof Product, value: string | number | boolean) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editedProduct)
    }
    onClose()
  }

  const handleDelete = () => {
    if (isDeleteConfirm && deleteConfirmText === "DELETE") {
      if (onDelete) {
        onDelete(product.id)
      }
      onClose()
    } else {
      setIsDeleteConfirm(true)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "In Stock": return "default"
      case "Low Stock": return "secondary"
      case "Out of Stock": return "destructive"
      default: return "outline"
    }
  }

  const calculateProfit = () => {
    const price = parseFloat(editedProduct.price.replace('$', '')) || 0
    const cost = parseFloat(editedProduct.cost.replace('$', '')) || 0
    if (cost > 0) {
      return ((price - cost) / cost * 100).toFixed(1)
    }
    return "0.0"
  }

  const getTitle = () => {
    switch (mode) {
      case 'view': return "Product Details"
      case 'edit': return "Edit Product"
      case 'delete': return "Delete Product"
    }
  }

  const getIcon = () => {
    switch (mode) {
      case 'view': return <Eye className="h-5 w-5" />
      case 'edit': return <Edit className="h-5 w-5" />
      case 'delete': return <Trash2 className="h-5 w-5" />
    }
  }

  const renderViewMode = () => (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Product Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusBadgeVariant(product.status)}>
                  {product.status}
                </Badge>
                <Badge variant="outline">
                  {product.category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{product.price}</div>
              <div className="text-sm text-muted-foreground">Selling Price</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Cost</span>
              </div>
              <div className="text-xl font-semibold">{product.cost}</div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Stock</span>
              </div>
              <div className="text-xl font-semibold">{product.stock}</div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Margin</span>
              </div>
              <div className="text-xl font-semibold text-green-600">
                {calculateProfit()}%
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* SKU & Barcode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                SKU
              </h4>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {product.sku}
                </code>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {product.barcode && (
              <div>
                <h4 className="font-medium mb-1 flex items-center gap-2">
                  <Barcode className="h-4 w-4" />
                  Barcode
                </h4>
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {product.barcode}
                </code>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Supplier Information */}
          {product.supplier && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Supplier Information
              </h4>
              <p className="text-muted-foreground">{product.supplier}</p>
            </div>
          )}

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4">
            {(product.weight || product.dimensions) && (
              <>
                {product.weight && (
                  <div>
                    <h4 className="font-medium mb-1">Weight</h4>
                    <p className="text-muted-foreground">{product.weight} kg</p>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <h4 className="font-medium mb-1">Dimensions</h4>
                    <p className="text-muted-foreground">{product.dimensions}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Status */}
          <div>
            <h4 className="font-medium mb-2">Product Status</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  product.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span>{product.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              {product.createdAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Added: {product.createdAt}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Sales Performance */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="font-medium">Sales This Month</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {product.salesCount || 0}
              </div>
              <div className="text-sm text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last month
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Customer Rating</span>
              </div>
              <div className="text-2xl font-bold mt-2">4.8</div>
              <div className="text-sm text-muted-foreground">
                Based on 24 reviews
              </div>
            </div>
          </div>

          {/* Restock Alert */}
          {product.status === "Low Stock" && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">Low Stock Alert</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    This product is running low on stock. Consider reordering soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {product.status === "Out of Stock" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Out of Stock</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This product is currently out of stock. Please reorder to continue sales.
                  </p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderEditMode = () => (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Name *
              </Label>
              <Input
                id="edit-name"
                value={editedProduct.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sku" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  SKU *
                </Label>
                <Input
                  id="edit-sku"
                  value={editedProduct.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Category *
                </Label>
                <Select
                  value={editedProduct.category}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Selling Price *
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={parseFloat(editedProduct.price.replace('$', '')) || ''}
                  onChange={(e) => handleInputChange("price", `$${e.target.value}`)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cost" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  Cost Price *
                </Label>
                <Input
                  id="edit-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={parseFloat(editedProduct.cost.replace('$', '')) || ''}
                  onChange={(e) => handleInputChange("cost", `$${e.target.value}`)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-stock" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Current Stock
                </Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={editedProduct.stock}
                  onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Status
                </Label>
                <Select
                  value={editedProduct.status}
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

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editedProduct.description || ''}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="edit-supplier" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Supplier
              </Label>
              <Select
                value={editedProduct.supplier || ''}
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
                <Label htmlFor="edit-barcode" className="flex items-center gap-2">
                  <Barcode className="h-4 w-4" />
                  Barcode
                </Label>
                <Input
                  id="edit-barcode"
                  value={editedProduct.barcode || ''}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-weight" className="flex items-center gap-2">
                  <Weight className="h-4 w-4" />
                  Weight (kg)
                </Label>
                <Input
                  id="edit-weight"
                  type="number"
                  step="0.001"
                  min="0"
                  value={editedProduct.weight || ''}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dimensions" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Dimensions
              </Label>
              <Input
                id="edit-dimensions"
                placeholder="L × W × H"
                value={editedProduct.dimensions || ''}
                onChange={(e) => handleInputChange("dimensions", e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="edit-active" className="text-base">
                  Product Active
                </Label>
                <p className="text-sm text-muted-foreground">
                  Product will be visible to customers
                </p>
              </div>
              <Switch
                id="edit-active"
                checked={editedProduct.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderDeleteMode = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <div>
          <h4 className="font-medium text-red-600">Warning: Product Deletion</h4>
          <p className="text-sm text-red-600">
            This action cannot be undone. All product data will be permanently deleted.
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-medium">{product.name}</h4>
            <p className="text-sm text-muted-foreground">{product.sku} • {product.category}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Stock</p>
            <p className="font-medium">{product.stock} units</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Selling Price</p>
            <p className="font-medium">{product.price}</p>
          </div>
        </div>
      </div>

      {isDeleteConfirm && (
        <div className="space-y-2">
          <Label htmlFor="confirmDelete" className="text-red-600">
            Type "DELETE" to confirm deletion
          </Label>
          <Input
            id="confirmDelete"
            placeholder="Type DELETE here"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className="border-red-300"
          />
          <p className="text-xs text-muted-foreground">
            This will permanently delete the product and all associated data.
          </p>
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (mode) {
      case 'view': return renderViewMode()
      case 'edit': return renderEditMode()
      case 'delete': return renderDeleteMode()
    }
  }

  const renderFooter = () => {
    switch (mode) {
      case 'view':
        return (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Switch to delete mode
                // In a real app, you might want to change the mode
                // For now, we'll show an alert
                if (confirm("Are you sure you want to delete this product?")) {
                  if (onDelete) onDelete(product.id)
                  onClose()
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Product
            </Button>
            <Button onClick={() => {
              // Switch to edit mode
              // In a real app, you might change the mode state
              // For now, we'll just close and open edit modal elsewhere
              onClose()
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </DialogFooter>
        )
      case 'edit':
        return (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        )
      case 'delete':
        return (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleteConfirm && deleteConfirmText !== "DELETE"}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleteConfirm ? 'Confirm Deletion' : 'Delete Product'}
            </Button>
          </DialogFooter>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' && 'View product details and performance'}
            {mode === 'edit' && 'Edit product information and settings'}
            {mode === 'delete' && 'Permanently delete this product from inventory'}
          </DialogDescription>
        </DialogHeader>

        {renderContent()}
        {renderFooter()}
      </DialogContent>
    </Dialog>
  )
}