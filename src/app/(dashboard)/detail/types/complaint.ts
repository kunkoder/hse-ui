export type ComplaintStatus = 
  | 'CREATED' | 'OPEN' | 'PENDING' | 'SCHEDULED' 
  | 'UNDER_OBSERVATION' | 'AWAITING_MATERIALS' 
  | 'DONE' | 'CLOSED' | 'REJECTED'

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type Category = 'MECHANICAL' | 'ELECTRICAL' | 'IT' | 'OTHER'

export interface Employee {
  employeeId: string
  name: string
  department: string
}

export interface Area {
  code: string
  name: string
  location: string
}

export interface Equipment {
  code: string
  name: string
  type: string
  status: string
}

export interface WorkOrder {
  code: string
  scheduledDate: string
  shift: string
  description: string
  status: 'SCHEDULED' | 'CLOSED' | 'POSTPONED'
}

export interface Complaint {
  id: string
  code: string
  status: ComplaintStatus
  subject: string
  priority: Priority
  category: Category
  reporter: Employee
  assignee?: Employee
  area?: Area
  equipments: Equipment[]
  reportDate: string
  closeTime?: string
  totalTimeMinutes?: number
  description: string
  actionTaken?: string
  imageBefore?: string
  imageAfter?: string
  reportsLinkedCodes: string[]
  scheduledWorkOrders: WorkOrder[]
  updatedAt: string
}