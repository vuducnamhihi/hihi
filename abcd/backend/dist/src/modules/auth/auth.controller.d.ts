import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginWithOtp(phoneNumber: string, otp: string, role: Role, fullName?: string): Promise<{
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
    getDemoUsers(): Promise<{
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
