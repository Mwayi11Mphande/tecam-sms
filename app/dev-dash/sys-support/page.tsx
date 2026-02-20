// app/dev-dash/reports/page.tsx
"use client"

import { useState } from "react"
import {
  IconBug,
  IconAlertCircle,
  IconMail,
  IconSend,
  IconUsers,
  IconBuildingStore,
  IconClock,
  IconDownload,
  IconFilter,
  IconSearch,
  IconMessage,
  IconBan,
  IconFlag,
  IconExclamationCircle,
  IconRefresh,
  IconTrash,
  IconEye,
  IconPencil,
  IconPaperclip,
  IconCopy,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconBug as IconBugReport,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Types
interface ErrorReport {
  id: string
  userId: string
  userName: string
  userEmail: string
  userRole: string
  shopId?: string
  shopName?: string
  title: string
  description: string
  category: "bug" | "feature_request" | "system_error" | "payment_issue" | "login_issue" | "performance" | "other"
  priority: "low" | "medium" | "high" | "critical"
  status: "new" | "in_progress" | "resolved" | "closed" | "needs_review"
  attachments?: string[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolvedBy?: string
  notes?: string
  stepsToReproduce?: string
  browserInfo?: string
  osInfo?: string
  appVersion?: string
}

interface EmailCampaign {
  id: string
  subject: string
  content: string
  recipients: "all" | "shop_owners" | "staff" | "specific"
  targetShops?: string[]
  targetUsers?: string[]
  status: "draft" | "scheduled" | "sent" | "failed"
  sentAt?: string
  scheduledFor?: string
  sentBy: string
  opens: number
  clicks: number
  attachments?: string[]
}

interface Client {
  id: string
  name: string
  email: string
  role: string
  shopName?: string
  status: "active" | "inactive" | "pending" | "suspended"
  lastActive?: string
}

// Mock Error Reports
const errorReports: ErrorReport[] = [
  {
    id: "1",
    userId: "u1",
    userName: "John Doe",
    userEmail: "john@techhaven.com",
    userRole: "shop_owner",
    shopId: "s1",
    shopName: "Tech Haven",
    title: "Cannot process credit card payments",
    description: "When trying to process a credit card payment, the system shows an error 'Payment gateway timeout'. This happens with all credit cards.",
    category: "payment_issue",
    priority: "high",
    status: "in_progress",
    createdAt: "2024-02-20T09:30:00Z",
    updatedAt: "2024-02-20T10:15:00Z",
    stepsToReproduce: "1. Go to sales page\n2. Add item to cart\n3. Try to pay with credit card\n4. See error after 30 seconds",
    browserInfo: "Chrome 121.0.6167.140",
    osInfo: "Windows 11",
    appVersion: "2.1.5",
    notes: "Payment gateway provider reported issues this morning",
  },
  {
    id: "2",
    userId: "u2",
    userName: "Jane Smith",
    userEmail: "jane@fashionhub.com",
    userRole: "shop_owner",
    shopId: "s2",
    shopName: "Fashion Hub",
    title: "Inventory count not updating",
    description: "After making a sale, the inventory count doesn't decrease. I have to manually update stock.",
    category: "bug",
    priority: "medium",
    status: "new",
    createdAt: "2024-02-20T11:45:00Z",
    updatedAt: "2024-02-20T11:45:00Z",
    stepsToReproduce: "1. Sell any item\n2. Check inventory\n3. Count remains the same",
    browserInfo: "Firefox 122.0",
    osInfo: "macOS 14.3",
    appVersion: "2.1.5",
  },
  {
    id: "3",
    userId: "u3",
    userName: "Bob Johnson",
    userEmail: "bob@grocerymart.com",
    userRole: "shop_owner",
    shopId: "s3",
    shopName: "Grocery Mart",
    title: "Can't login after password reset",
    description: "I reset my password but the new password doesn't work. I've tried multiple times.",
    category: "login_issue",
    priority: "critical",
    status: "needs_review",
    createdAt: "2024-02-20T08:15:00Z",
    updatedAt: "2024-02-20T08:15:00Z",
    browserInfo: "Safari 17.3",
    osInfo: "iOS 17.3",
    appVersion: "2.1.5",
  },
  {
    id: "4",
    userId: "u4",
    userName: "Alice Brown",
    userEmail: "alice@bookstore.com",
    userRole: "shop_owner",
    shopId: "s4",
    shopName: "Bookstore Plus",
    title: "Reports not generating",
    description: "When I try to generate monthly sales reports, the page loads indefinitely and never shows the report.",
    category: "system_error",
    priority: "high",
    status: "new",
    createdAt: "2024-02-19T16:20:00Z",
    updatedAt: "2024-02-19T16:20:00Z",
    browserInfo: "Chrome 120.0.6099.217",
    osInfo: "Windows 10",
    appVersion: "2.1.4",
  },
  {
    id: "5",
    userId: "u5",
    userName: "Charlie Wilson",
    userEmail: "charlie@electronics.com",
    userRole: "shop_owner",
    shopId: "s5",
    shopName: "Electronics World",
    title: "Request: Bulk price update feature",
    description: "It would be great to have a feature to update prices in bulk via CSV upload.",
    category: "feature_request",
    priority: "low",
    status: "new",
    createdAt: "2024-02-19T14:30:00Z",
    updatedAt: "2024-02-19T14:30:00Z",
    appVersion: "2.1.5",
  },
]

// Mock Clients for email
const clients: Client[] = [
  { id: "1", name: "Tech Haven", email: "contact@techhaven.com", role: "shop", shopName: "Tech Haven", status: "active", lastActive: "2024-02-20T10:30:00Z" },
  { id: "2", name: "Fashion Hub", email: "info@fashionhub.com", role: "shop", shopName: "Fashion Hub", status: "active", lastActive: "2024-02-20T09:15:00Z" },
  { id: "3", name: "Grocery Mart", email: "support@grocerymart.com", role: "shop", shopName: "Grocery Mart", status: "pending", lastActive: "2024-02-19T16:45:00Z" },
  { id: "4", name: "Bookstore Plus", email: "hello@bookstore.com", role: "shop", shopName: "Bookstore Plus", status: "suspended", lastActive: "2024-02-18T11:20:00Z" },
  { id: "5", name: "Electronics World", email: "sales@electronics.com", role: "shop", shopName: "Electronics World", status: "active", lastActive: "2024-02-20T11:00:00Z" },
  { id: "6", name: "John Doe", email: "john@techhaven.com", role: "owner", shopName: "Tech Haven", status: "active", lastActive: "2024-02-20T10:30:00Z" },
  { id: "7", name: "Jane Smith", email: "jane@fashionhub.com", role: "owner", shopName: "Fashion Hub", status: "active", lastActive: "2024-02-20T09:15:00Z" },
]

// Mock Email Campaigns
const emailCampaigns: EmailCampaign[] = [
  {
    id: "1",
    subject: "Scheduled Maintenance - Feb 25th",
    content: "Dear valued customer,\n\nWe will be performing scheduled maintenance on February 25th from 2AM to 4AM EST. During this time, the system may be unavailable.\n\nWe apologize for any inconvenience.\n\nBest regards,\nThe Team",
    recipients: "all",
    status: "scheduled",
    scheduledFor: "2024-02-22T09:00:00Z",
    sentBy: "admin@system.com",
    opens: 0,
    clicks: 0,
  },
  {
    id: "2",
    subject: "New Feature: Bulk Inventory Update",
    content: "We're excited to announce a new feature that allows you to update your inventory in bulk using CSV files. Check it out in your dashboard!",
    recipients: "all",
    status: "sent",
    sentAt: "2024-02-18T10:00:00Z",
    sentBy: "admin@system.com",
    opens: 156,
    clicks: 89,
  },
  {
    id: "3",
    subject: "Payment Issue Resolution",
    content: "We have resolved the payment processing issues reported earlier today. All systems are now operational.",
    recipients: "shop_owners",
    status: "sent",
    sentAt: "2024-02-19T14:30:00Z",
    sentBy: "admin@system.com",
    opens: 45,
    clicks: 23,
  },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("errors")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  
  // Selected items
  const [selectedReport, setSelectedReport] = useState<ErrorReport | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  
  // Dialog states
  const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false)
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false)
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false)
  const [createEmailDialogOpen, setCreateEmailDialogOpen] = useState(false)
  const [viewCampaignDialogOpen, setViewCampaignDialogOpen] = useState(false)
  const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false)
  const [clientSelectOpen, setClientSelectOpen] = useState(false)
  const [confirmSendDialogOpen, setConfirmSendDialogOpen] = useState(false)
  
  // Form states
  const [statusUpdate, setStatusUpdate] = useState("")
  const [resolutionNote, setResolutionNote] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [emailRecipients, setEmailRecipients] = useState<"all" | "shop_owners" | "staff" | "specific">("all")
  const [selectedTargetShops, setSelectedTargetShops] = useState<string[]>([])
  const [selectedTargetUsers, setSelectedTargetUsers] = useState<string[]>([])
  const [scheduleDate, setScheduleDate] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter error reports
  const filteredReports = errorReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || report.priority === filterPriority
    const matchesStatus = filterStatus === "all" || report.status === filterStatus
    const matchesCategory = filterCategory === "all" || report.category === filterCategory
    return matchesSearch && matchesPriority && matchesStatus && matchesCategory
  })

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-blue-500",
      medium: "bg-yellow-500",
      high: "bg-orange-500",
      critical: "bg-red-500",
    }
    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {priority}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      new: "bg-purple-500",
      in_progress: "bg-blue-500",
      resolved: "bg-green-500",
      closed: "bg-gray-500",
      needs_review: "bg-orange-500",
    }
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace("_", " ")}
      </Badge>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "bug": return <IconBug className="h-4 w-4" />
      case "feature_request": return <IconFlag className="h-4 w-4" />
      case "system_error": return <IconExclamationCircle className="h-4 w-4" />
      case "payment_issue": return <IconAlertCircle className="h-4 w-4" />
      case "login_issue": return <IconBan className="h-4 w-4" />
      default: return <IconInfoCircle className="h-4 w-4" />
    }
  }

  const handleViewReport = (report: ErrorReport) => {
    setSelectedReport(report)
    setViewReportDialogOpen(true)
  }

  const handleUpdateStatus = (report: ErrorReport) => {
    setSelectedReport(report)
    setStatusUpdate(report.status)
    setResolutionNote("")
    setUpdateStatusDialogOpen(true)
  }

  const handleAddNote = (report: ErrorReport) => {
    setSelectedReport(report)
    setResolutionNote("")
    setAddNoteDialogOpen(true)
  }

  const handleSaveStatusUpdate = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Updating status:", selectedReport?.id, statusUpdate, resolutionNote)
    setIsProcessing(false)
    setUpdateStatusDialogOpen(false)
  }

  const handleSaveNote = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Adding note to:", selectedReport?.id, resolutionNote)
    setIsProcessing(false)
    setAddNoteDialogOpen(false)
  }

  const handleCreateEmail = () => {
    setEmailSubject("")
    setEmailContent("")
    setEmailRecipients("all")
    setSelectedTargetShops([])
    setSelectedTargetUsers([])
    setScheduleDate("")
    setAttachments([])
    setCreateEmailDialogOpen(true)
  }

  const handleSendEmail = async () => {
    if (!emailSubject || !emailContent) {
      alert("Please fill in subject and content")
      return
    }
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log("Sending email:", {
      subject: emailSubject,
      content: emailContent,
      recipients: emailRecipients,
      targetShops: selectedTargetShops,
      targetUsers: selectedTargetUsers,
      scheduledFor: scheduleDate || null,
    })
    setIsProcessing(false)
    setCreateEmailDialogOpen(false)
    setConfirmSendDialogOpen(false)
  }

  const handleBroadcastNow = () => {
    if (!emailSubject || !emailContent) {
      alert("Please fill in subject and content")
      return
    }
    setConfirmSendDialogOpen(true)
  }

  const getRecipientCount = () => {
    switch(emailRecipients) {
      case "all": return clients.length
      case "shop_owners": return clients.filter(c => c.role === "owner" || c.role === "shop").length
      case "staff": return clients.filter(c => c.role === "staff").length
      case "specific": return selectedTargetUsers.length
      default: return 0
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Reports & Communications</h1>
          <p className="text-muted-foreground">Monitor error reports and communicate with clients</p>
        </div>
        <Button onClick={handleCreateEmail}>
          <IconMail className="mr-2 h-4 w-4" />
          New Broadcast
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <IconBugReport className="h-4 w-4" />
            Error Reports
            <Badge variant="secondary" className="ml-1">
              {errorReports.filter(r => r.status === "new" || r.status === "needs_review").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <IconMail className="h-4 w-4" />
            Email Campaigns
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <IconUsers className="h-4 w-4" />
            Client List
          </TabsTrigger>
        </TabsList>

        {/* Error Reports Tab */}
        <TabsContent value="errors" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {errorReports.filter(r => r.status === "new").length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {errorReports.filter(r => r.status === "in_progress").length}
                </div>
                <p className="text-xs text-muted-foreground">Being worked on</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {errorReports.filter(r => r.priority === "critical" && r.status !== "resolved").length}
                </div>
                <p className="text-xs text-muted-foreground">Need immediate attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.5h</div>
                <p className="text-xs text-muted-foreground">Average response time</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports by title, description, user, shop..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="needs_review">Needs Review</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature_request">Feature Request</SelectItem>
                      <SelectItem value="system_error">System Error</SelectItem>
                      <SelectItem value="payment_issue">Payment Issue</SelectItem>
                      <SelectItem value="login_issue">Login Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>User/Shop</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-xs">#{report.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{report.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {report.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{report.userName}</p>
                          <p className="text-xs text-muted-foreground">{report.shopName || "No shop"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(report.category)}
                          <span className="text-sm">{report.category.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconClock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewReport(report)}
                          >
                            <IconEye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateStatus(report)}
                          >
                            <IconPencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAddNote(report)}
                          >
                            <IconMessage className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Campaigns Tab */}
        <TabsContent value="email" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailCampaigns.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {emailCampaigns.filter(c => c.status === "scheduled").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>Manage your broadcast emails and communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                    onClick={() => {
                      setSelectedCampaign(campaign)
                      setViewCampaignDialogOpen(true)
                    }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{campaign.subject}</span>
                        <Badge variant={
                          campaign.status === "sent" ? "default" :
                          campaign.status === "scheduled" ? "secondary" :
                          "outline"
                        }>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {campaign.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>To: {campaign.recipients}</span>
                        {campaign.sentAt && (
                          <span>Sent: {new Date(campaign.sentAt).toLocaleDateString()}</span>
                        )}
                        {campaign.scheduledFor && (
                          <span>Scheduled: {new Date(campaign.scheduledFor).toLocaleDateString()}</span>
                        )}
                        <span>Opens: {campaign.opens}</span>
                        <span>Clicks: {campaign.clicks}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <IconEye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client List Tab */}
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>View and manage your clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients by name, email, or shop..."
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Shop</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{client.role}</Badge>
                        </TableCell>
                        <TableCell>{client.shopName || "-"}</TableCell>
                        <TableCell>
                          <Badge className={
                            client.status === "active" ? "bg-green-500" :
                            client.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                          }>
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {client.lastActive ? new Date(client.lastActive).toLocaleDateString() : "Never"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <IconMail className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Report Dialog */}
      <Dialog open={viewReportDialogOpen} onOpenChange={setViewReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Error Report Details</DialogTitle>
            <DialogDescription>
              Detailed information about the reported issue
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedReport.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Reported by {selectedReport.userName} • {selectedReport.userEmail}
                    </p>
                    {selectedReport.shopName && (
                      <p className="text-sm text-muted-foreground">
                        Shop: {selectedReport.shopName}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {getPriorityBadge(selectedReport.priority)}
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{selectedReport.description}</p>
                </div>

                {selectedReport.stepsToReproduce && (
                  <div>
                    <Label className="text-muted-foreground">Steps to Reproduce</Label>
                    <p className="mt-1 text-sm whitespace-pre-wrap">{selectedReport.stepsToReproduce}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Browser</Label>
                    <p className="text-sm">{selectedReport.browserInfo || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">OS</Label>
                    <p className="text-sm">{selectedReport.osInfo || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">App Version</Label>
                    <p className="text-sm">{selectedReport.appVersion || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p className="text-sm capitalize">{selectedReport.category.replace("_", " ")}</p>
                  </div>
                </div>

                {selectedReport.notes && (
                  <div>
                    <Label className="text-muted-foreground">Internal Notes</Label>
                    <p className="mt-1 text-sm bg-muted/50 p-2 rounded">{selectedReport.notes}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Created: {new Date(selectedReport.createdAt).toLocaleString()}
                  {selectedReport.resolvedAt && (
                    <> • Resolved: {new Date(selectedReport.resolvedAt).toLocaleString()}</>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewReportDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewReportDialogOpen(false)
              if (selectedReport) handleUpdateStatus(selectedReport)
            }}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Report Status</DialogTitle>
            <DialogDescription>
              Change the status and add resolution notes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Resolution Notes</Label>
              <Textarea
                placeholder="Add notes about the resolution..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="notify-user" />
              <Label htmlFor="notify-user">Notify user about status change</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStatusUpdate} disabled={isProcessing}>
              {isProcessing ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={addNoteDialogOpen} onOpenChange={setAddNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Internal Note</DialogTitle>
            <DialogDescription>
              Add a private note to this report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter your note..."
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote} disabled={isProcessing}>
              {isProcessing ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Email Dialog */}
      <Dialog open={createEmailDialogOpen} onOpenChange={setCreateEmailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Broadcast Email</DialogTitle>
            <DialogDescription>
              Send an email to your clients
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Recipients</Label>
                <RadioGroup value={emailRecipients} onValueChange={(v: any) => setEmailRecipients(v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Clients ({clients.length})</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shop_owners" id="shop_owners" />
                    <Label htmlFor="shop_owners">Shop Owners ({clients.filter(c => c.role === "owner" || c.role === "shop").length})</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="staff" id="staff" />
                    <Label htmlFor="staff">Staff Members ({clients.filter(c => c.role === "staff").length})</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific" />
                    <Label htmlFor="specific">Specific Clients</Label>
                  </div>
                </RadioGroup>
              </div>

              {emailRecipients === "specific" && (
                <div className="space-y-2">
                  <Label>Select Recipients</Label>
                  <Popover open={clientSelectOpen} onOpenChange={setClientSelectOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={clientSelectOpen}
                        className="w-full justify-between"
                      >
                        {selectedTargetUsers.length > 0
                          ? `${selectedTargetUsers.length} recipients selected`
                          : "Select clients..."}
                        <IconFilter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search clients..." />
                        <CommandList>
                          <CommandEmpty>No clients found.</CommandEmpty>
                          <CommandGroup>
                            {clients.map((client) => (
                              <CommandItem
                                key={client.id}
                                onSelect={() => {
                                  setSelectedTargetUsers(prev =>
                                    prev.includes(client.id)
                                      ? prev.filter(id => id !== client.id)
                                      : [...prev, client.id]
                                  )
                                }}
                              >
                                <Checkbox
                                  checked={selectedTargetUsers.includes(client.id)}
                                  className="mr-2"
                                />
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback>{client.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{client.name}</p>
                                  <p className="text-xs text-muted-foreground">{client.email}</p>
                                </div>
                                <Badge variant="outline">{client.role}</Badge>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your email content..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Schedule (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="border rounded-lg p-4">
                  <Button variant="outline" className="w-full">
                    <IconPaperclip className="mr-2 h-4 w-4" />
                    Add Attachments
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium">Summary</p>
                <p className="text-sm text-muted-foreground mt-1">
                  To: {emailRecipients === "specific" ? `${selectedTargetUsers.length} recipients` : emailRecipients.replace("_", " ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Subject: {emailSubject || "(no subject)"}
                </p>
                {scheduleDate && (
                  <p className="text-sm text-muted-foreground">
                    Scheduled for: {new Date(scheduleDate).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => {
              setCreateEmailDialogOpen(false)
              // Save as draft
            }}>
              Save as Draft
            </Button>
            <Button onClick={handleBroadcastNow} disabled={isProcessing}>
              {scheduleDate ? "Schedule" : "Send Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Send Dialog */}
      <AlertDialog open={confirmSendDialogOpen} onOpenChange={setConfirmSendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Broadcast Email?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send this email to {getRecipientCount()} recipients.
              {scheduleDate && ` It will be scheduled for ${new Date(scheduleDate).toLocaleString()}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendEmail}>
              {scheduleDate ? "Schedule" : "Send Now"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Campaign Dialog */}
      <Dialog open={viewCampaignDialogOpen} onOpenChange={setViewCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedCampaign.subject}</h3>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                  {selectedCampaign.content}
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="ml-2">{selectedCampaign.status}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Recipients:</span>
                  <span className="ml-2">{selectedCampaign.recipients}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Opens:</span>
                  <span className="ml-2">{selectedCampaign.opens}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Clicks:</span>
                  <span className="ml-2">{selectedCampaign.clicks}</span>
                </div>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                {selectedCampaign.sentAt && (
                  <p>Sent: {new Date(selectedCampaign.sentAt).toLocaleString()}</p>
                )}
                {selectedCampaign.scheduledFor && (
                  <p>Scheduled: {new Date(selectedCampaign.scheduledFor).toLocaleString()}</p>
                )}
                <p>Sent by: {selectedCampaign.sentBy}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewCampaignDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => {
              setViewCampaignDialogOpen(false)
              // Duplicate campaign
            }}>
              <IconCopy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}