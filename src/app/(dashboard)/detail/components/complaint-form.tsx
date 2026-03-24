"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { 
  Check, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, Plus, Trash2, Save, Upload, Camera, Calendar, Clock,
  Link as LinkIcon, Wrench, FileSignature, Images, AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type { Complaint, ComplaintStatus, Priority, Category, Employee, Area, Equipment } from '../types/complaint'
import { dummyComplaint, dummyUsers, dummyAreas, dummyEquipments } from '../data/complaint-data'

// Status Badge Configuration
const statusConfig: Record<ComplaintStatus, { variant: string, label: string }> = {
  CREATED: { variant: 'secondary', label: 'Created' },
  OPEN: { variant: 'warning', label: 'Open' },
  PENDING: { variant: 'warning', label: 'Pending' },
  SCHEDULED: { variant: 'info', label: 'Scheduled' },
  UNDER_OBSERVATION: { variant: 'info', label: 'Under Observation' },
  AWAITING_MATERIALS: { variant: 'info', label: 'Awaiting Materials' },
  DONE: { variant: 'default', label: 'Done' },
  CLOSED: { variant: 'success', label: 'Closed' },
  REJECTED: { variant: 'destructive', label: 'Rejected' },
}

const priorityConfig: Record<Priority, { variant: string }> = {
  HIGH: { variant: 'destructive' },
  MEDIUM: { variant: 'warning' },
  LOW: { variant: 'success' },
}

const categoryConfig: Record<Category, { variant: string }> = {
  MECHANICAL: { variant: 'info' },
  ELECTRICAL: { variant: 'destructive' },
  IT: { variant: 'success' },
  OTHER: { variant: 'secondary' },
}

interface ComplaintFormProps {
  initialData?: Complaint
  onSave?: (data: Complaint) => void
  onDelete?: (id: string) => void
}

export function ComplaintForm({ 
  initialData = dummyComplaint, 
  onSave,
  onDelete 
}: ComplaintFormProps) {
  const [complaint, setComplaint] = useState<Complaint>(initialData)
  const [isEditing, setIsEditing] = useState(false)
  const [editedFields, setEditedFields] = useState<Partial<Complaint>>({})
  
  // Search states
  const [assigneeSearch, setAssigneeSearch] = useState('')
  const [areaSearch, setAreaSearch] = useState('')
  const [equipmentSearch, setEquipmentSearch] = useState('')
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)
  const [showAreaDropdown, setShowAreaDropdown] = useState(false)
  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false)
  
  // Image states
  const [imageBefore, setImageBefore] = useState<string | undefined>(complaint.imageBefore)
  const [imageAfter, setImageAfter] = useState<string | undefined>(complaint.imageAfter)
  
  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [showAddReportModal, setShowAddReportModal] = useState(false)
  const [showAddWorkOrderModal, setShowAddWorkOrderModal] = useState(false)
  const [showZoomModal, setShowZoomModal] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string>('')

  // Filter dropdowns
  const filteredUsers = dummyUsers.filter(user =>
    user.name.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
    user.employeeId.toLowerCase().includes(assigneeSearch.toLowerCase())
  )

  const filteredAreas = dummyAreas.filter(area =>
    area.name.toLowerCase().includes(areaSearch.toLowerCase()) ||
    area.code.toLowerCase().includes(areaSearch.toLowerCase())
  )

  const filteredEquipments = dummyEquipments.filter(eq =>
    eq.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
    eq.code.toLowerCase().includes(equipmentSearch.toLowerCase())
  )

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Handle field edit
  const handleFieldEdit = (field: keyof Complaint, value: any) => {
    setEditedFields(prev => ({ ...prev, [field]: value }))
  }

  // Handle save
  // const handleSave = () => {
  //   const updatedComplaint = { ...complaint, ...editedFields }
  //   onSave?.(updatedComplaint)
  //   setIsEditing(false)
  //   setEditedFields({})
  // }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === 'before') {
          setImageBefore(result)
          handleFieldEdit('imageBefore', result)
        } else {
          setImageAfter(result)
          handleFieldEdit('imageAfter', result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Open zoom modal
  const openZoomModal = (src: string) => {
    setZoomedImage(src)
    setShowZoomModal(true)
  }

  // Equipment tag management
  const [selectedEquipments, setSelectedEquipments] = useState<Equipment[]>(complaint.equipments)

  const addEquipment = (equipment: Equipment) => {
    if (!selectedEquipments.find(eq => eq.code === equipment.code)) {
      setSelectedEquipments([...selectedEquipments, equipment])
      handleFieldEdit('equipments', [...selectedEquipments, equipment])
    }
    setEquipmentSearch('')
    setShowEquipmentDropdown(false)
  }

  const removeEquipment = (code: string) => {
    const updated = selectedEquipments.filter(eq => eq.code !== code)
    setSelectedEquipments(updated)
    handleFieldEdit('equipments', updated)
  }

  // Range input for equipment
  const [showRangeInput, setShowRangeInput] = useState(false)
  const [rangeInput, setRangeInput] = useState('')

  const handleRangeApply = () => {
    // Parse range format: BASE/START-END (e.g., AQPCK-1023/1-3)
    const match = rangeInput.match(/^([A-Z]+-\d+)\/(\d+)-(\d+)$/i)
    if (match) {
      const base = match[1]
      const start = parseInt(match[2])
      const end = parseInt(match[3])
      const newEquipments: Equipment[] = []
      
      for (let i = start; i <= end; i++) {
        const code = `${base}-${i}`
        const existing = dummyEquipments.find(eq => eq.code === code)
        if (existing && !selectedEquipments.find(eq => eq.code === code)) {
          newEquipments.push(existing)
        }
      }
      
      if (newEquipments.length > 0) {
        const updated = [...selectedEquipments, ...newEquipments]
        setSelectedEquipments(updated)
        handleFieldEdit('equipments', updated)
      }
    }
    setRangeInput('')
    setShowRangeInput(false)
  }

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Complaint Details</h2>
                <p className="text-sm text-muted-foreground">
                  {complaint.code}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setShowStatusModal(true)}
                  >
                    <Badge 
                      variant={statusConfig[complaint.status].variant as any}
                      className="cursor-pointer"
                    >
                      {statusConfig[complaint.status].label}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {Object.keys(statusConfig).map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => {
                        handleFieldEdit('status', status as ComplaintStatus)
                        setShowStatusModal(false)
                      }}
                      className="cursor-pointer"
                    >
                      {statusConfig[status as ComplaintStatus].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {/* Approval Panel */}
            {complaint.status === 'CREATED' && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="mb-2 font-semibold flex items-center">
                      <Check className="w-4 h-4 mr-2" />
                      Approval Required
                    </h6>
                    <p className="text-sm text-muted-foreground">
                      This complaint requires your approval before it can be processed.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => setShowApprovalModal(true)}
                      className="cursor-pointer"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setShowRejectionModal(true)}
                      className="cursor-pointer"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Subject */}
            <div className="mb-6">
              {isEditing ? (
                <Input
                  value={editedFields.subject ?? complaint.subject}
                  onChange={(e) => handleFieldEdit('subject', e.target.value)}
                  className="text-lg font-semibold"
                />
              ) : (
                <h3 
                  className="text-lg font-semibold cursor-text border-b-2 border-dashed border-gray-300 pb-2 hover:border-blue-500 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  {complaint.subject}
                </h3>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">MAINTENANCE</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Badge 
                    variant={priorityConfig[complaint.priority].variant as any}
                    className="cursor-pointer"
                  >
                    {complaint.priority} PRIORITY
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.keys(priorityConfig).map((priority) => (
                    <DropdownMenuItem
                      key={priority}
                      onClick={() => handleFieldEdit('priority', priority as Priority)}
                      className="cursor-pointer"
                    >
                      {priority}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Badge 
                    variant={categoryConfig[complaint.category].variant as any}
                    className="cursor-pointer"
                  >
                    {complaint.category}
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.keys(categoryConfig).map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => handleFieldEdit('category', category as Category)}
                      className="cursor-pointer"
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Reporter */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    <strong>Reporter:</strong>
                    <span className="ml-2 text-muted-foreground">
                      {complaint.reporter.name} ({complaint.reporter.employeeId})
                    </span>
                  </p>
                </div>

                {/* Assignee */}
                <div className="relative">
                  <Label className="mb-2">Assignee</Label>
                  <div className="relative">
                    <Input
                      value={assigneeSearch || complaint.assignee?.name || ''}
                      onChange={(e) => {
                        setAssigneeSearch(e.target.value)
                        setShowAssigneeDropdown(true)
                      }}
                      onFocus={() => setShowAssigneeDropdown(true)}
                      placeholder="Search assignee by name or ID"
                      className="border-b border-t-0 border-x-0 rounded-none focus:border-blue-500"
                    />
                    {showAssigneeDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.employeeId}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleFieldEdit('assignee', user)
                              setAssigneeSearch(user.name)
                              setShowAssigneeDropdown(false)
                            }}
                          >
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.employeeId} - {user.department}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Area */}
                <div className="relative">
                  <Label className="mb-2">Area</Label>
                  <div className="relative">
                    <Input
                      value={areaSearch || complaint.area?.name || ''}
                      onChange={(e) => {
                        setAreaSearch(e.target.value)
                        setShowAreaDropdown(true)
                      }}
                      onFocus={() => setShowAreaDropdown(true)}
                      placeholder="Search area..."
                      className="border-b border-t-0 border-x-0 rounded-none focus:border-blue-500"
                    />
                    {showAreaDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredAreas.map((area) => (
                          <div
                            key={area.code}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleFieldEdit('area', area)
                              setAreaSearch(area.name)
                              setShowAreaDropdown(false)
                            }}
                          >
                            <p className="font-medium">{area.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {area.code} - {area.location}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Equipment(s) <span className="text-red-500">*</span></Label>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={showRangeInput ? "default" : "outline"}
                        onClick={() => setShowRangeInput(!showRangeInput)}
                        className="cursor-pointer"
                      >
                        <Search className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={!showRangeInput ? "default" : "outline"}
                        onClick={() => setShowRangeInput(!showRangeInput)}
                        className="cursor-pointer"
                      >
                        <span className="text-xs">#</span>
                      </Button>
                    </div>
                  </div>

                  {showRangeInput ? (
                    <div className="flex gap-2">
                      <Input
                        value={rangeInput}
                        onChange={(e) => setRangeInput(e.target.value)}
                        placeholder="e.g. AQPCK-1023/1-3"
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleRangeApply} className="cursor-pointer">
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        value={equipmentSearch}
                        onChange={(e) => {
                          setEquipmentSearch(e.target.value)
                          setShowEquipmentDropdown(true)
                        }}
                        onFocus={() => setShowEquipmentDropdown(true)}
                        placeholder="Add equipment..."
                        className="border-b border-t-0 border-x-0 rounded-none focus:border-blue-500"
                      />
                      {showEquipmentDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {filteredEquipments
                            .filter(eq => !selectedEquipments.find(s => s.code === eq.code))
                            .map((equipment) => (
                              <div
                                key={equipment.code}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => addEquipment(equipment)}
                              >
                                <p className="font-medium">{equipment.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {equipment.code} - {equipment.type}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Equipment Tags */}
                  <div className="flex flex-wrap gap-2 mt-2 p-2 border-b border-dashed">
                    {selectedEquipments.map((eq) => (
                      <Badge key={eq.code} variant="outline" className="gap-1">
                        {eq.name} ({eq.code})
                        <button
                          onClick={() => removeEquipment(eq.code)}
                          className="ml-1 hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Report Date */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    <strong>Report Date:</strong>
                    <span className="ml-2 text-muted-foreground">
                      {formatDate(complaint.reportDate)}
                    </span>
                  </p>
                </div>

                {/* Close Time */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    <strong>Close Time:</strong>
                    <span 
                      className="ml-2 text-muted-foreground cursor-pointer hover:text-blue-500"
                      onClick={() => {
                        const input = document.getElementById('closeTimeInput') as HTMLInputElement
                        if (input) {
                          input.showPicker?.()
                          input.focus()
                        }
                      }}
                    >
                      {complaint.closeTime ? formatDate(complaint.closeTime) : 'Click to set'}
                    </span>
                  </p>
                  <Input
                    id="closeTimeInput"
                    type="datetime-local"
                    value={editedFields.closeTime ?? complaint.closeTime ?? ''}
                    onChange={(e) => handleFieldEdit('closeTime', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Total Time */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    <strong>Total Time:</strong>
                    <span className="ml-2 text-muted-foreground">
                      {complaint.totalTimeMinutes ? `${complaint.totalTimeMinutes} minutes` : '-'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Linked Reports */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="flex items-center font-semibold">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Linked Reports
                </h5>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowAddReportModal(true)}
                    className="cursor-pointer"
                  >
                    <LinkIcon className="w-4 h-4 mr-1" />
                    Link Report
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setShowAddReportModal(true)}
                    className="cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create Report
                  </Button>
                </div>
              </div>
              {complaint.reportsLinkedCodes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {complaint.reportsLinkedCodes.map((code) => (
                    <Badge key={code} variant="secondary">
                      {code}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Scheduled Work Orders */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="flex items-center font-semibold">
                  <FileSignature className="w-5 h-5 mr-2 text-blue-500" />
                  Scheduled Orders
                </h5>
                <Button 
                  size="sm"
                  onClick={() => setShowAddWorkOrderModal(true)}
                  className="cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Order
                </Button>
              </div>
              {complaint.scheduledWorkOrders.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Work Order</TableHead>
                        <TableHead>Scheduled Date</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[90px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaint.scheduledWorkOrders.map((wo) => (
                        <TableRow key={wo.code}>
                          <TableCell>
                            <code className="bg-gray-100 px-2 py-1 rounded">
                              {wo.code}
                            </code>
                          </TableCell>
                          <TableCell>
                            {formatDate(wo.scheduledDate)}
                          </TableCell>
                          <TableCell>{wo.shift}</TableCell>
                          <TableCell>{wo.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                wo.status === 'CLOSED' ? 'default' :
                                wo.status === 'SCHEDULED' ? 'secondary' :
                                'destructive'
                              }
                            >
                              {wo.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-4 bg-gray-50 border rounded-md">
                  <p className="text-sm">No scheduled orders.</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h5 className="flex items-center font-semibold mb-3">
                <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                Description
              </h5>
              <Textarea
                value={editedFields.description ?? complaint.description}
                onChange={(e) => handleFieldEdit('description', e.target.value)}
                rows={6}
                className="bg-gray-50"
                readOnly={!isEditing}
              />
            </div>

            {/* Action Taken */}
            <div className="mb-6">
              <h5 className="flex items-center font-semibold mb-3">
                <Wrench className="w-5 h-5 mr-2 text-blue-500" />
                Action Taken
              </h5>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-md">
                <p className="text-sm">
                  <strong>Guidance:</strong> Please describe the action taken including:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li><strong>Who</strong> performed the action</li>
                  <li><strong>How</strong> it was carried out</li>
                  <li><strong>When</strong> it occurred (date/time)</li>
                  <li>Current <strong>status</strong> of the complaint</li>
                </ul>
              </div>
              <Textarea
                value={editedFields.actionTaken ?? complaint.actionTaken ?? ''}
                onChange={(e) => handleFieldEdit('actionTaken', e.target.value)}
                rows={6}
                placeholder="Enter action details here..."
                className="bg-gray-50"
                readOnly={!isEditing}
              />
            </div>

            {/* Visual Documentation */}
            <div className="mb-6">
              <h5 className="flex items-center font-semibold mb-4">
                <Images className="w-5 h-5 mr-2 text-blue-500" />
                Visual Documentation
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Image */}
                <Card>
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold flex items-center">
                        <Camera className="w-4 h-4 mr-2 text-blue-500" />
                        Before Repair
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => document.getElementById('imageBeforeFile')?.click()}
                        className="cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                      {imageBefore ? (
                        <img
                          src={imageBefore}
                          alt="Before Repair"
                          className="max-h-[300px] rounded-md cursor-pointer"
                          onClick={() => openZoomModal(imageBefore)}
                        />
                      ) : (
                        <div className="text-muted-foreground">
                          <Camera className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">No image</p>
                        </div>
                      )}
                    </div>
                    <Input
                      id="imageBeforeFile"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'before')}
                    />
                    {imageBefore && (
                      <div className="mt-2">
                        <label className="flex items-center text-sm text-red-500 cursor-pointer">
                          <input type="checkbox" className="mr-2" />
                          Delete this image
                        </label>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* After Image */}
                <Card>
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold flex items-center">
                        <Camera className="w-4 h-4 mr-2 text-blue-500" />
                        After Repair
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => document.getElementById('imageAfterFile')?.click()}
                        className="cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                      {imageAfter ? (
                        <img
                          src={imageAfter}
                          alt="After Repair"
                          className="max-h-[300px] rounded-md cursor-pointer"
                          onClick={() => openZoomModal(imageAfter)}
                        />
                      ) : (
                        <div className="text-muted-foreground">
                          <Camera className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">No image</p>
                        </div>
                      )}
                    </div>
                    <Input
                      id="imageAfterFile"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'after')}
                    />
                    {imageAfter && (
                      <div className="mt-2">
                        <label className="flex items-center text-sm text-red-500 cursor-pointer">
                          <input type="checkbox" className="mr-2" />
                          Delete this image
                        </label>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t mt-6">
              <p className="text-sm text-muted-foreground">
                Last updated: {formatDate(complaint.updatedAt)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  // onClick={() => setShowDeleteModal(true)}
                  className="cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  // onClick={handleSave}
                  className="cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Change Modal */}
        <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Status</DialogTitle>
              <DialogDescription>
                Select the new status for this complaint.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              {Object.keys(statusConfig).map((status) => (
                <Button
                  key={status}
                  variant="outline"
                  className="justify-start cursor-pointer"
                  onClick={() => {
                    handleFieldEdit('status', status as ComplaintStatus)
                    setShowStatusModal(false)
                  }}
                >
                  <Badge 
                    variant={statusConfig[status as ComplaintStatus].variant as any}
                    className="mr-2"
                  >
                    {statusConfig[status as ComplaintStatus].label}
                  </Badge>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Complaint</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {complaint.code}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  onDelete?.(complaint.id)
                  setShowDeleteModal(false)
                }}
                className="cursor-pointer"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approval Modal */}
        <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Complaint</DialogTitle>
              <DialogDescription>
                Confirm that you approve this complaint for processing.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApprovalModal(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  handleFieldEdit('status', 'OPEN')
                  setShowApprovalModal(false)
                }}
                className="cursor-pointer"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rejection Modal */}
        <Dialog open={showRejectionModal} onOpenChange={setShowRejectionModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Complaint</DialogTitle>
              <DialogDescription>
                Provide a reason for rejection.
              </DialogDescription>
            </DialogHeader>
            <Textarea 
              placeholder="Rejection reason..." 
              className="mt-2"
              rows={4}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectionModal(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  handleFieldEdit('status', 'REJECTED')
                  setShowRejectionModal(false)
                }}
                className="cursor-pointer"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Report Modal */}
        <Dialog open={showAddReportModal} onOpenChange={setShowAddReportModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Report</DialogTitle>
              <DialogDescription>
                Link or create a new work report.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Report functionality would be implemented here.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddReportModal(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Work Order Modal */}
        <Dialog open={showAddWorkOrderModal} onOpenChange={setShowAddWorkOrderModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Work Order</DialogTitle>
              <DialogDescription>
                Schedule a new work order for this complaint.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label>Description</Label>
                <Input placeholder="Work order description" />
              </div>
              <div>
                <Label>Scheduled Date</Label>
                <Input type="datetime-local" />
              </div>
              <div>
                <Label>Shift</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddWorkOrderModal(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Zoom Image Modal */}
        <Dialog open={showZoomModal} onOpenChange={setShowZoomModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <img src={zoomedImage} alt="Zoomed" className="max-h-[70vh] rounded-md" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}