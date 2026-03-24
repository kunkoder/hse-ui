import type { Complaint, Employee, Area, Equipment, WorkOrder } from '../types/complaint'

export const dummyUsers: Employee[] = [
  { employeeId: 'EMP001', name: 'John Doe', department: 'Maintenance' },
  { employeeId: 'EMP002', name: 'Jane Smith', department: 'Engineering' },
  { employeeId: 'EMP003', name: 'Bob Wilson', department: 'Operations' },
  { employeeId: 'EMP004', name: 'Alice Brown', department: 'Maintenance' },
  { employeeId: 'EMP005', name: 'Charlie Davis', department: 'IT' },
]

export const dummyAreas: Area[] = [
  { code: 'AREA-A', name: 'Production Line A', location: 'Building 1' },
  { code: 'AREA-B', name: 'Production Line B', location: 'Building 1' },
  { code: 'AREA-C', name: 'Warehouse', location: 'Building 2' },
  { code: 'AREA-D', name: 'Office Area', location: 'Building 3' },
]

export const dummyEquipments: Equipment[] = [
  { code: 'AQPCK-1023', name: 'Packaging Machine A', type: 'Mechanical', status: 'Active' },
  { code: 'AQPCK-1024', name: 'Packaging Machine B', type: 'Mechanical', status: 'Active' },
  { code: 'ELCMTR-2001', name: 'Main Motor Controller', type: 'Electrical', status: 'Active' },
  { code: 'ITSRV-3001', name: 'Production Server', type: 'IT', status: 'Active' },
  { code: 'AQPCK-1025', name: 'Packaging Machine C', type: 'Mechanical', status: 'Maintenance' },
]

export const dummyWorkOrders: WorkOrder[] = [
  {
    code: 'WO-2024-001',
    scheduledDate: '2024-03-25T08:00',
    shift: 'Morning',
    description: 'Replace worn parts',
    status: 'SCHEDULED',
  },
  {
    code: 'WO-2024-002',
    scheduledDate: '2024-03-26T14:00',
    shift: 'Afternoon',
    description: 'Electrical inspection',
    status: 'CLOSED',
  },
]

export const dummyComplaint: Complaint = {
  id: 'CMP-2024-00123',
  code: 'CMP-2024-00123',
  status: 'OPEN',
  subject: 'Packaging Machine A - Abnormal Noise',
  priority: 'HIGH',
  category: 'MECHANICAL',
  reporter: dummyUsers[0],
  assignee: dummyUsers[1],
  area: dummyAreas[0],
  equipments: [dummyEquipments[0]],
  reportDate: '2024-03-20T09:30',
  closeTime: undefined,
  totalTimeMinutes: undefined,
  description: 'Machine producing abnormal noise during operation. Requires immediate inspection.',
  actionTaken: 'Initial inspection completed. Waiting for spare parts.',
  imageBefore: 'https://via.placeholder.com/600x400?text=Before+Repair',
  imageAfter: undefined,
  reportsLinkedCodes: ['RPT-2024-001', 'RPT-2024-002'],
  scheduledWorkOrders: dummyWorkOrders,
  updatedAt: '2024-03-21T14:30',
}