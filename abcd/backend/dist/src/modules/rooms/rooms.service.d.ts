import { PrismaService } from '../../prisma/prisma.service';
import { RoomStatus } from '@prisma/client';
export declare class RoomsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createRoom(motelId: string, data: {
        roomNumber: string;
        floor: number;
        areaSqm: number;
        basePrice: number;
        isSelfContained?: boolean;
        description?: string;
        amenities?: string[];
        images?: string[];
    }): Promise<{
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
    }>;
    searchRooms(query: {
        city?: string;
        district?: string;
        minPrice?: number;
        maxPrice?: number;
        minArea?: number;
        maxArea?: number;
        isSelfContained?: boolean;
        status?: RoomStatus;
    }): Promise<({
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
    })[]>;
    getRoomById(id: string): Promise<{
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
    }>;
    updateRoom(id: string, data: any): Promise<{
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
    }>;
    updateRoomStatus(id: string, status: RoomStatus): Promise<{
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
    }>;
    deleteRoom(id: string): Promise<{
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
    }>;
}
