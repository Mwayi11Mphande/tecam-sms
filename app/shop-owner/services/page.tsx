"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  DollarSign,
  Tag,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { serviceApi } from "@/lib/services/service.service"
import { formatMK } from "@/lib/currency"

type ServiceItem = {
  id: string
  name: string
  price: number
  isActive: boolean
  createdAt: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceItem | null>(null)
  const [formName, setFormName] = useState("")
  const [formPrice, setFormPrice] = useState("")

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingService, setDeletingService] = useState<ServiceItem | null>(null)

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await serviceApi.getAll()
      const data = Array.isArray(res) ? res : ((res as any).services || (res as any).data || [])
      setServices(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message || "Failed to load services")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const filteredServices = useMemo(() => {
    if (!searchQuery) return services
    const q = searchQuery.toLowerCase()
    return services.filter(s =>
      s.name.toLowerCase().includes(q)
    )
  }, [services, searchQuery])

  function openAddDialog() {
    setEditingService(null)
    setFormName("")
    setFormPrice("")
    setDialogOpen(true)
  }

  function openEditDialog(service: ServiceItem) {
    setEditingService(service)
    setFormName(service.name)
    setFormPrice(String(service.price))
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!formName.trim()) { alert("Service name is required"); return }
    if (!formPrice || parseFloat(formPrice) <= 0) { alert("Valid price is required"); return }

    try {
      setSaving(true)
      if (editingService) {
        await serviceApi.update(editingService.id, { name: formName.trim(), price: parseFloat(formPrice) })
      } else {
        await serviceApi.create({ name: formName.trim(), price: parseFloat(formPrice) })
      }
      setDialogOpen(false)
      await fetchServices()
    } catch (err: any) {
      alert(err.message || "Failed to save service")
    } finally {
      setSaving(false)
    }
  }

  function openDeleteDialog(service: ServiceItem) {
    setDeletingService(service)
    setDeleteDialogOpen(true)
  }

  async function handleDelete() {
    if (!deletingService) return
    try {
      setSaving(true)
      await serviceApi.delete(deletingService.id)
      setDeleteDialogOpen(false)
      setDeletingService(null)
      await fetchServices()
    } catch (err: any) {
      alert(err.message || "Failed to delete service")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-10 w-10 mx-auto text-red-500" />
          <p className="text-red-500 font-medium">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Services</h1>
          <p className="text-muted-foreground">
            Add, edit, and remove services your shop offers
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No services match your search." : "No services yet. Add your first service!"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{formatMK(service.price)}</TableCell>
                    <TableCell>
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(service)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(service)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
            <DialogDescription>
              {editingService ? "Update the service details" : "Add a new service your shop offers"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Service Name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Haircut, Document Printing, Nail Art"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editingService ? "Save Changes" : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingService?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
