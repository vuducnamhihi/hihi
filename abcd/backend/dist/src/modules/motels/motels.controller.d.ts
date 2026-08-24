import { MotelsService } from './motels.service';
export declare class MotelsController {
    private readonly motelsService;
    constructor(motelsService: MotelsService);
    createMotel(landlordId: string, body: any): Promise<{
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
    }>;
    getMyMotels(landlordId: string): Promise<({
        rooms: {
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
        }[];
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
    })[]>;
    getMotelById(id: string): Promise<{
        rooms: ({
            contracts: ({
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
            })[];
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
        })[];
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
    }>;
    updateMotel(id: string, landlordId: string, body: any): Promise<{
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
    }>;
    deleteMotel(id: string): Promise<{
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
    }>;
}
