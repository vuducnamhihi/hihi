import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    loginWithPhoneOtp(phoneNumber: string, otp: string, role?: Role, fullName?: string): Promise<{
        accessToken: string;
        user: {
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
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        phoneNumber: string;
        fullName: string;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        fcmToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllDemoUsers(): Promise<{
        id: string;
        phoneNumber: string;
        fullName: string;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        fcmToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
