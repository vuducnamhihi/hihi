export type Role = 'LANDLORD' | 'TENANT' | 'ADMIN';

export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export type ContractStatus = 'ACTIVE' | 'PENDING' | 'TERMINATED' | 'EXPIRED';

export type InvoiceStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PAYMENT_SUBMITTED'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
}

export interface Motel {
  id: string;
  landlordId: string;
  name: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  rooms?: Room[];
}

export interface Room {
  id: string;
  motelId: string;
  roomNumber: string;
  floor: number;
  areaSqm: number;
  basePrice: number;
  isSelfContained: boolean;
  status: RoomStatus;
  description?: string;
  amenities: string[];
  images: string[];
  motel?: Motel;
  contracts?: Contract[];
}

export interface Contract {
  id: string;
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  rentalPrice: number;
  depositAmount: number;
  paymentDay: number;
  status: ContractStatus;
  contractFileUrl?: string;
  room?: Room;
  tenant?: User;
}

export interface Invoice {
  id: string;
  contractId: string;
  roomId: string;
  tenantId: string;
  periodMonth: number;
  periodYear: number;
  roomAmount: number;
  electricityUsage: number;
  electricityAmount: number;
  waterUsage: number;
  waterAmount: number;
  otherFees: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentProofUrl?: string;
  dueDate: string;
  paidAt?: string;
  tenantNote?: string;
  room?: Room;
  tenant?: User;
  contract?: Contract;
}
