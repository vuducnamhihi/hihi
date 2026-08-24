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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const invoices_service_1 = require("./invoices.service");
const storage_service_1 = require("../storage/storage.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let InvoicesController = class InvoicesController {
    constructor(invoicesService, storageService) {
        this.invoicesService = invoicesService;
        this.storageService = storageService;
    }
    async getLandlordInvoices(landlordId, motelId, periodMonth, periodYear, status) {
        return await this.invoicesService.getInvoicesForLandlord(landlordId, {
            motelId,
            periodMonth: periodMonth ? parseInt(periodMonth, 10) : undefined,
            periodYear: periodYear ? parseInt(periodYear, 10) : undefined,
            status,
        });
    }
    async getTenantInvoices(tenantId) {
        return await this.invoicesService.getInvoicesForTenant(tenantId);
    }
    async getInvoiceById(id) {
        return await this.invoicesService.getInvoiceById(id);
    }
    async approveInvoice(id, body) {
        return await this.invoicesService.updateAndApproveInvoice(id, {
            ...body,
            approveImmediately: true,
        });
    }
    async updateDraftInvoice(id, body) {
        return await this.invoicesService.updateAndApproveInvoice(id, {
            ...body,
            approveImmediately: false,
        });
    }
    async submitPayment(id, file, note) {
        let billUrl = '';
        if (file) {
            const uploadResult = await this.storageService.uploadFile(file, 'bills');
            billUrl = uploadResult.url;
        }
        return await this.invoicesService.submitPaymentProof(id, billUrl, note);
    }
    async confirmPaid(id) {
        return await this.invoicesService.confirmPaymentSuccess(id);
    }
    async triggerGenerateCron(month, year) {
        return await this.invoicesService.triggerGenerateMonthly(month, year);
    }
};
exports.InvoicesController = InvoicesController;
__decorate([
    (0, common_1.Get)('landlord/my-invoices'),
    (0, roles_decorator_1.Roles)(client_1.Role.LANDLORD),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('motelId')),
    __param(2, (0, common_1.Query)('periodMonth')),
    __param(3, (0, common_1.Query)('periodYear')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getLandlordInvoices", null);
__decorate([
    (0, common_1.Get)('tenant/my-invoices'),
    (0, roles_decorator_1.Roles)(client_1.Role.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getTenantInvoices", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getInvoiceById", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, roles_decorator_1.Roles)(client_1.Role.LANDLORD),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "approveInvoice", null);
__decorate([
    (0, common_1.Put)(':id/update-draft'),
    (0, roles_decorator_1.Roles)(client_1.Role.LANDLORD),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "updateDraftInvoice", null);
__decorate([
    (0, common_1.Post)(':id/submit-payment'),
    (0, roles_decorator_1.Roles)(client_1.Role.TENANT),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('billImage')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('note')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "submitPayment", null);
__decorate([
    (0, common_1.Put)(':id/confirm-paid'),
    (0, roles_decorator_1.Roles)(client_1.Role.LANDLORD),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "confirmPaid", null);
__decorate([
    (0, common_1.Post)('trigger-cron'),
    (0, roles_decorator_1.Roles)(client_1.Role.LANDLORD, client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)('month')),
    __param(1, (0, common_1.Body)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "triggerGenerateCron", null);
exports.InvoicesController = InvoicesController = __decorate([
    (0, common_1.Controller)('invoices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService,
        storage_service_1.StorageService])
], InvoicesController);
//# sourceMappingURL=invoices.controller.js.map