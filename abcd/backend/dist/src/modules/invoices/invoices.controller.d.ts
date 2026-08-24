import { InvoicesService } from './invoices.service';
import { StorageService } from '../storage/storage.service';
import { InvoiceStatus } from '@prisma/client';
export declare class InvoicesController {
    private readonly invoicesService;
    private readonly storageService;
    constructor(invoicesService: InvoicesService, storageService: StorageService);
    getLandlordInvoices(landlordId: string, motelId?: string, periodMonth?: string, periodYear?: string, status?: InvoiceStatus): Promise<({
        room: {
            motel: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string;
                ward: string;
                district: string;
                city: string;
                electricityUnitPrice: import("@prisma/client/runtime/library").Decimal;
                waterUnitPrice: import("@prisma/client/runtime/library").Decimal;
                landlordId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: number;
            areaSqm: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            isSelfContained: boolean;
            status: import(".prisma/client").$Enums.RoomStatus;
            description: string | null;
            amenities: string[];
            images: string[];
            motelId: string;
        };
        tenant: {
            id: string;
            phoneNumber: string;
            fullName: string;
            avatarUrl: string | null;
            role: import(".prisma/client").$Enums.Role;
            fcmToken: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        contract: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ContractStatus;
            startDate: Date;
            endDate: Date;
            rentalPrice: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
            paymentDay: number;
            contractFileUrl: string | null;
            roomId: string;
            tenantId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        roomId: string;
        tenantId: string;
        periodMonth: number;
        periodYear: number;
        roomAmount: import("@prisma/client/runtime/library").Decimal;
        electricityUsage: number;
        electricityAmount: import("@prisma/client/runtime/library").Decimal;
        waterUsage: number;
        waterAmount: import("@prisma/client/runtime/library").Decimal;
        otherFees: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentProofUrl: string | null;
        dueDate: Date;
        paidAt: Date | null;
        tenantNote: string | null;
        contractId: string;
    })[]>;
    getTenantInvoices(tenantId: string): Promise<({
        room: {
            motel: {
                landlord: {
                    id: string;
                    phoneNumber: string;
                    fullName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string;
                ward: string;
                district: string;
                city: string;
                electricityUnitPrice: import("@prisma/client/runtime/library").Decimal;
                waterUnitPrice: import("@prisma/client/runtime/library").Decimal;
                landlordId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: number;
            areaSqm: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            isSelfContained: boolean;
            status: import(".prisma/client").$Enums.RoomStatus;
            description: string | null;
            amenities: string[];
            images: string[];
            motelId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        roomId: string;
        tenantId: string;
        periodMonth: number;
        periodYear: number;
        roomAmount: import("@prisma/client/runtime/library").Decimal;
        electricityUsage: number;
        electricityAmount: import("@prisma/client/runtime/library").Decimal;
        waterUsage: number;
        waterAmount: import("@prisma/client/runtime/library").Decimal;
        otherFees: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentProofUrl: string | null;
        dueDate: Date;
        paidAt: Date | null;
        tenantNote: string | null;
        contractId: string;
    })[]>;
    getInvoiceById(id: string): Promise<{
        room: {
            motel: {
                landlord: {
                    id: string;
                    phoneNumber: string;
                    fullName: string;
                    avatarUrl: string | null;
                    role: import(".prisma/client").$Enums.Role;
                    fcmToken: string | null;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string;
                ward: string;
                district: string;
                city: string;
                electricityUnitPrice: import("@prisma/client/runtime/library").Decimal;
                waterUnitPrice: import("@prisma/client/runtime/library").Decimal;
                landlordId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: number;
            areaSqm: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            isSelfContained: boolean;
            status: import(".prisma/client").$Enums.RoomStatus;
            description: string | null;
            amenities: string[];
            images: string[];
            motelId: string;
        };
        tenant: {
            id: string;
            phoneNumber: string;
            fullName: string;
            avatarUrl: string | null;
            role: import(".prisma/client").$Enums.Role;
            fcmToken: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        contract: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ContractStatus;
            startDate: Date;
            endDate: Date;
            rentalPrice: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
            paymentDay: number;
            contractFileUrl: string | null;
            roomId: string;
            tenantId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        roomId: string;
        tenantId: string;
        periodMonth: number;
        periodYear: number;
        roomAmount: import("@prisma/client/runtime/library").Decimal;
        electricityUsage: number;
        electricityAmount: import("@prisma/client/runtime/library").Decimal;
        waterUsage: number;
        waterAmount: import("@prisma/client/runtime/library").Decimal;
        otherFees: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentProofUrl: string | null;
        dueDate: Date;
        paidAt: Date | null;
        tenantNote: string | null;
        contractId: string;
    }>;
    approveInvoice(id: string, body: any): Promise<{
        room: {
            motel: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string;
                ward: string;
                district: string;
                city: string;
                electricityUnitPrice: import("@prisma/client/runtime/library").Decimal;
                waterUnitPrice: import("@prisma/client/runtime/library").Decimal;
                landlordId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: number;
            areaSqm: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            isSelfContained: boolean;
            status: import(".prisma/client").$Enums.RoomStatus;
            description: string | null;
            amenities: string[];
            images: string[];
            motelId: string;
        };
        tenant: {
            id: string;
            phoneNumber: string;
            fullName: string;
            avatarUrl: string | null;
            role: import(".prisma/client").$Enums.Role;
            fcmToken: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        roomId: string;
        tenantId: string;
        periodMonth: number;
        periodYear: number;
        roomAmount: import("@prisma/client/runtime/library").Decimal;
        electricityUsage: number;
        electricityAmount: import("@prisma/client/runtime/library").Decimal;
        waterUsage: number;
        waterAmount: import("@prisma/client/runtime/library").Decimal;
        otherFees: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentProofUrl: string | null;
        dueDate: Date;
        paidAt: Date | null;
        tenantNote: string | null;
        contractId: string;
    }>;
    updateDraftInvoice(id: string, body: any): Promise<{
        room: {
            motel: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string;
                ward: string;
                district: string;
                city: string;
                electricityUnitPrice: import("@prisma/client/runtime/library").Decimal;
                waterUnitPrice: import("@prisma/client/runtime/library").Decimal;
                landlordId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: number;
            areaSqm: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            isSelfContained: boolean;
            status: import(".prisma/client").$Enums.RoomStatus;
            description: string | null;
            amenities: string[];
            images: string[];
            motelId: string;
        };
        tenant: {
            id: string;
            phoneNumber: string;
            fullName: string;
            avatarUrl: string | null;
            role: import(".prisma/client").$Enums.Role;
            fcmToken: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        roomId: string;
        tenantId: string;
        periodMonth: number;
        periodYear: number;
        roomAmount: import("@prisma/client/runtime/library").Decimal;
        electricityUsage: number;
        electricityAmount: import("@prisma/client/runtime/library").Decimal;
        waterUsage: number;
        waterAmount: import("@prisma/client/runtime/library").Decimal;
        otherFees: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentProofUrl: string | null;
        dueDate: Date;
        paidAt: Date | null;
        tenantNote: string | null;
        contractId: string;
    }>;
    submitPayment(id: string, file: Express.Multer.File, note?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        roomId: string;
        tenantId: string;
        periodMonth: number;
        periodYear: number;
        roomAmount: import("@prisma/client/runtime/library").Decimal;
        electricityUsage: number;
        electricityAmount: import("@prisma/client/runtime/library").Decimal;
        waterUsage: number;
        waterAmount: import("@prisma/client/runtime/library").Decimal;
        otherFees: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentProofUrl: string | null;
        dueDate: Date;
        paidAt: Date | null;
        tenantNote: string | null;
        contractId: string;
    }>;
    confirmPaid(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        roomId: string;
        tenantId: string;
        periodMonth: number;
        periodYear: number;
        roomAmount: import("@prisma/client/runtime/library").Decimal;
        electricityUsage: number;
        electricityAmount: import("@prisma/client/runtime/library").Decimal;
        waterUsage: number;
        waterAmount: import("@prisma/client/runtime/library").Decimal;
        otherFees: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentProofUrl: string | null;
        dueDate: Date;
        paidAt: Date | null;
        tenantNote: string | null;
        contractId: string;
    }>;
    triggerGenerateCron(month?: number, year?: number): Promise<{
        success: boolean;
        period: string;
        createdInvoicesCount: number;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        period?: undefined;
        createdInvoicesCount?: undefined;
    } | {
        message: string;
        jobId: string;
    }>;
}
