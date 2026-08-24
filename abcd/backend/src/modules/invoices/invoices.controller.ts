import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoicesService } from './invoices.service';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, InvoiceStatus } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly storageService: StorageService,
  ) {}

  @Get('landlord/my-invoices')
  @Roles(Role.LANDLORD)
  async getLandlordInvoices(
    @CurrentUser('id') landlordId: string,
    @Query('motelId') motelId?: string,
    @Query('periodMonth') periodMonth?: string,
    @Query('periodYear') periodYear?: string,
    @Query('status') status?: InvoiceStatus,
  ) {
    return await this.invoicesService.getInvoicesForLandlord(landlordId, {
      motelId,
      periodMonth: periodMonth ? parseInt(periodMonth, 10) : undefined,
      periodYear: periodYear ? parseInt(periodYear, 10) : undefined,
      status,
    });
  }

  @Get('tenant/my-invoices')
  @Roles(Role.TENANT)
  async getTenantInvoices(@CurrentUser('id') tenantId: string) {
    return await this.invoicesService.getInvoicesForTenant(tenantId);
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string) {
    return await this.invoicesService.getInvoiceById(id);
  }

  /**
   * Chủ trọ: Nhập số điện nước và Duyệt hóa đơn
   */
  @Put(':id/approve')
  @Roles(Role.LANDLORD)
  async approveInvoice(@Param('id') id: string, @Body() body: any) {
    return await this.invoicesService.updateAndApproveInvoice(id, {
      ...body,
      approveImmediately: true,
    });
  }

  /**
   * Chủ trọ: Cập nhật thông số hóa đơn tạm lưu (vẫn ở DRAFT)
   */
  @Put(':id/update-draft')
  @Roles(Role.LANDLORD)
  async updateDraftInvoice(@Param('id') id: string, @Body() body: any) {
    return await this.invoicesService.updateAndApproveInvoice(id, {
      ...body,
      approveImmediately: false,
    });
  }

  /**
   * Người thuê: Tải ảnh bill chuyển tiền lên MinIO & gửi xác nhận
   */
  @Post(':id/submit-payment')
  @Roles(Role.TENANT)
  @UseInterceptors(FileInterceptor('billImage'))
  async submitPayment(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('note') note?: string,
  ) {
    let billUrl = '';
    if (file) {
      const uploadResult = await this.storageService.uploadFile(file, 'bills');
      billUrl = uploadResult.url;
    }
    return await this.invoicesService.submitPaymentProof(id, billUrl, note);
  }

  /**
   * Chủ trọ: Xác nhận đã nhận tiền (PAID)
   */
  @Put(':id/confirm-paid')
  @Roles(Role.LANDLORD)
  async confirmPaid(@Param('id') id: string) {
    return await this.invoicesService.confirmPaymentSuccess(id);
  }

  /**
   * Kích hoạt quét tự động tạo hóa đơn tháng ngay lập tức
   */
  @Post('trigger-cron')
  @Roles(Role.LANDLORD, Role.ADMIN)
  async triggerGenerateCron(
    @Body('month') month?: number,
    @Body('year') year?: number,
  ) {
    return await this.invoicesService.triggerGenerateMonthly(month, year);
  }
}
