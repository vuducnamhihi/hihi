import { PrismaService } from '../../prisma/prisma.service';
export declare class ContractsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createContract(data: {
        roomId: string;
        tenantId?: string;
        tenantPhone?: string;
        tenantName?: string;
        startDate: Date;
        endDate: Date;
        rentalPrice: number;
        depositAmount: number;
        paymentDay?: number;
        contractFileUrl?: string;
    }): Promise<{
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
    }>;
    getContractsByLandlord(landlordId: string): Promise<({
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
        status: import(".prisma/client").$Enums.ContractStatus;
        startDate: Date;
        endDate: Date;
        rentalPrice: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        paymentDay: number;
        contractFileUrl: string | null;
        roomId: string;
        tenantId: string;
    })[]>;
    getContractsByTenant(tenantId: string): Promise<({
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
        status: import(".prisma/client").$Enums.ContractStatus;
        startDate: Date;
        endDate: Date;
        rentalPrice: import("@prisma/client/runtime/library").Decimal;
        depositAmount: import("@prisma/client/runtime/library").Decimal;
        paymentDay: number;
        contractFileUrl: string | null;
        roomId: string;
        tenantId: string;
    })[]>;
    terminateContract(id: string): Promise<{
        success: boolean;
        message: string;
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
    }>;
}
