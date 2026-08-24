import { PrismaService } from '../../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';
import { QueueService } from '../queue/queue.service';
export declare class InvoicesService {
    private readonly prisma;
    private readonly queueService;
    constructor(prisma: PrismaService, queueService: QueueService);
    getInvoicesForLandlord(landlordId: string, filter?: {
        motelId?: string;
        periodMonth?: number;
        periodYear?: number;
        status?: InvoiceStatus;
    }): Promise<({
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
    getInvoicesForTenant(tenantId: string): Promise<({
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
    updateAndApproveInvoice(id: string, data: {
        electricityUsage?: number;
        waterUsage?: number;
        otherFees?: number;
        roomAmount?: number;
        oldElectricity?: number;
        newElectricity?: number;
        oldWater?: number;
        newWater?: number;
        approveImmediately?: boolean;
    }): Promise<{
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
    submitPaymentProof(id: string, paymentProofUrl: string, tenantNote?: string): Promise<{
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
    confirmPaymentSuccess(id: string): Promise<{
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
    triggerGenerateMonthly(month?: number, year?: number): Promise<{
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
