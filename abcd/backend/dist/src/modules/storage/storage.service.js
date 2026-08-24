"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = require("minio");
const uuid_1 = require("uuid");
const path = require("path");
const fs = require("fs");
let StorageService = StorageService_1 = class StorageService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(StorageService_1.name);
        this.minioClient = null;
        this.isMinioAvailable = false;
        this.localUploadDir = path.join(process.cwd(), 'uploads');
        this.defaultBucket = this.configService.get('MINIO_BUCKET', 'nhatro-storage');
        if (!fs.existsSync(this.localUploadDir)) {
            fs.mkdirSync(this.localUploadDir, { recursive: true });
        }
        try {
            this.minioClient = new Minio.Client({
                endPoint: this.configService.get('MINIO_ENDPOINT', 'localhost'),
                port: parseInt(this.configService.get('MINIO_PORT', '9000'), 10),
                useSSL: this.configService.get('MINIO_USE_SSL', 'false') === 'true',
                accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
                secretKey: this.configService.get('MINIO_SECRET_KEY', 'minioadminpassword'),
            });
        }
        catch (e) {
            this.logger.warn('MinIO Client initialization error:', e.message);
        }
    }
    async onModuleInit() {
        await this.checkMinioConnection();
    }
    async checkMinioConnection() {
        if (!this.minioClient)
            return;
        try {
            const exists = await this.minioClient.bucketExists(this.defaultBucket);
            if (!exists) {
                await this.minioClient.makeBucket(this.defaultBucket, 'us-east-1');
                this.logger.log(`Tạo thành công MinIO bucket: ${this.defaultBucket}`);
            }
            this.isMinioAvailable = true;
            this.logger.log(`Kết nối MinIO S3 thành công. Bucket: ${this.defaultBucket}`);
        }
        catch (error) {
            this.isMinioAvailable = false;
            this.logger.warn(`Chưa kết nối được MinIO server (${error.message}). Hệ thống sẽ kích hoạt Local Storage fallback.`);
        }
    }
    async uploadFile(file, folder = 'bills') {
        const ext = path.extname(file.originalname || '.jpg');
        const fileKey = `${folder}/${(0, uuid_1.v4)()}${ext}`;
        if (this.isMinioAvailable && this.minioClient) {
            try {
                await this.minioClient.putObject(this.defaultBucket, fileKey, file.buffer, file.size, { 'Content-Type': file.mimetype || 'image/jpeg' });
                const endpoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
                const port = this.configService.get('MINIO_PORT', '9000');
                const url = `http://${endpoint}:${port}/${this.defaultBucket}/${fileKey}`;
                return { fileKey, url, storageType: 'minio' };
            }
            catch (e) {
                this.logger.error('Lỗi khi tải file lên MinIO, chuyển sang lưu trữ cục bộ:', e);
            }
        }
        const targetFolder = path.join(this.localUploadDir, folder);
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
        }
        const localFilePath = path.join(this.localUploadDir, fileKey);
        fs.writeFileSync(localFilePath, file.buffer);
        const port = this.configService.get('PORT', 3000);
        const url = `http://localhost:${port}/uploads/${fileKey}`;
        return { fileKey, url, storageType: 'local' };
    }
    async getPresignedDownloadUrl(fileKey, expirySeconds = 3600) {
        if (this.isMinioAvailable && this.minioClient) {
            try {
                return await this.minioClient.presignedGetObject(this.defaultBucket, fileKey, expirySeconds);
            }
            catch (e) {
                this.logger.error('Lỗi sinh Presigned URL từ MinIO:', e);
            }
        }
        const port = this.configService.get('PORT', 3000);
        return `http://localhost:${port}/uploads/${fileKey}`;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map