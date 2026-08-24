import { StorageService } from './storage.service';
export declare class StorageController {
    private readonly storageService;
    constructor(storageService: StorageService);
    uploadFile(file: Express.Multer.File, folder?: 'bills' | 'rooms' | 'contracts'): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            fileKey: string;
            url: string;
            storageType: "minio" | "local";
        };
        message?: undefined;
    }>;
    getPresignedUrl(fileKey: string): Promise<{
        success: boolean;
        url: string;
    }>;
}
