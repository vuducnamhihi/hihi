import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private minioClient: Minio.Client | null = null;
  private readonly defaultBucket: string;
  private isMinioAvailable = false;
  private localUploadDir = path.join(process.cwd(), 'uploads');

  constructor(private readonly configService: ConfigService) {
    this.defaultBucket = this.configService.get<string>('MINIO_BUCKET', 'nhatro-storage');
    
    // Ensure local uploads directory exists as fallback
    if (!fs.existsSync(this.localUploadDir)) {
      fs.mkdirSync(this.localUploadDir, { recursive: true });
    }

    try {
      this.minioClient = new Minio.Client({
        endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
        port: parseInt(this.configService.get<string>('MINIO_PORT', '9000'), 10),
        useSSL: this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true',
        accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
        secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadminpassword'),
      });
    } catch (e) {
      this.logger.warn('MinIO Client initialization error:', e.message);
    }
  }

  async onModuleInit() {
    await this.checkMinioConnection();
  }

  private async checkMinioConnection() {
    if (!this.minioClient) return;
    try {
      const exists = await this.minioClient.bucketExists(this.defaultBucket);
      if (!exists) {
        await this.minioClient.makeBucket(this.defaultBucket, 'us-east-1');
        this.logger.log(`Tạo thành công MinIO bucket: ${this.defaultBucket}`);
      }
      this.isMinioAvailable = true;
      this.logger.log(`Kết nối MinIO S3 thành công. Bucket: ${this.defaultBucket}`);
    } catch (error) {
      this.isMinioAvailable = false;
      this.logger.warn(`Chưa kết nối được MinIO server (${error.message}). Hệ thống sẽ kích hoạt Local Storage fallback.`);
    }
  }

  /**
   * Upload file lên MinIO Object Storage (hoặc Local Storage nếu MinIO chưa chạy)
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: 'bills' | 'rooms' | 'contracts' = 'bills',
  ): Promise<{ fileKey: string; url: string; storageType: 'minio' | 'local' }> {
    const ext = path.extname(file.originalname || '.jpg');
    const fileKey = `${folder}/${uuidv4()}${ext}`;

    if (this.isMinioAvailable && this.minioClient) {
      try {
        await this.minioClient.putObject(
          this.defaultBucket,
          fileKey,
          file.buffer,
          file.size,
          { 'Content-Type': file.mimetype || 'image/jpeg' },
        );
        const endpoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
        const port = this.configService.get('MINIO_PORT', '9000');
        const url = `http://${endpoint}:${port}/${this.defaultBucket}/${fileKey}`;
        return { fileKey, url, storageType: 'minio' };
      } catch (e) {
        this.logger.error('Lỗi khi tải file lên MinIO, chuyển sang lưu trữ cục bộ:', e);
      }
    }

    // Local Storage Fallback
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

  /**
   * Tạo Presigned Download URL cho tài liệu nhạy cảm (Bill, PDF hợp đồng)
   */
  async getPresignedDownloadUrl(fileKey: string, expirySeconds = 3600): Promise<string> {
    if (this.isMinioAvailable && this.minioClient) {
      try {
        return await this.minioClient.presignedGetObject(this.defaultBucket, fileKey, expirySeconds);
      } catch (e) {
        this.logger.error('Lỗi sinh Presigned URL từ MinIO:', e);
      }
    }
    const port = this.configService.get('PORT', 3000);
    return `http://localhost:${port}/uploads/${fileKey}`;
  }
}
