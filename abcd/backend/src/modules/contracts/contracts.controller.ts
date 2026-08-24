import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @Roles(Role.LANDLORD)
  async createContract(@Body() body: any) {
    return await this.contractsService.createContract(body);
  }

  @Get('landlord/my-contracts')
  @Roles(Role.LANDLORD)
  async getLandlordContracts(@CurrentUser('id') landlordId: string) {
    return await this.contractsService.getContractsByLandlord(landlordId);
  }

  @Get('tenant/my-contracts')
  @Roles(Role.TENANT)
  async getTenantContracts(@CurrentUser('id') tenantId: string) {
    return await this.contractsService.getContractsByTenant(tenantId);
  }

  @Put(':id/terminate')
  @Roles(Role.LANDLORD)
  async terminateContract(@Param('id') id: string) {
    return await this.contractsService.terminateContract(id);
  }
}
