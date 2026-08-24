import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class StorageService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private minioClient;
    private readonly defaultBucket;
    private isMinioAvailable;
    private localUploadDir;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private checkMinioConnection;
    uploadFile(file: Express.Multer.File, folder?: 'bills' | 'rooms' | 'contracts'): Promise<{
        fileKey: string;
        url: string;
        storageType: 'minio' | 'local';
    }>;
    getPresignedDownloadUrl(fileKey: string, expirySeconds?: number): Promise<string>;
}
