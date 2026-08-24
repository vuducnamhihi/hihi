import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: 'bills' | 'rooms' | 'contracts' = 'rooms',
  ) {
    if (!file) {
      return { success: false, message: 'Vui lòng đính kèm file' };
    }
    const result = await this.storageService.uploadFile(file, folder);
    return {
      success: true,
      data: result,
    };
  }

  @Get('presigned-url')
  async getPresignedUrl(@Query('key') fileKey: string) {
    const url = await this.storageService.getPresignedDownloadUrl(fileKey);
    return {
      success: true,
      url,
    };
  }
}
