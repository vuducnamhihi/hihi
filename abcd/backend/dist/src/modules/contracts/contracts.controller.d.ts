import { ContractsService } from './contracts.service';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    createContract(body: any): Promise<{
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
    getLandlordContracts(landlordId: string): Promise<({
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
    getTenantContracts(tenantId: string): Promise<({
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
