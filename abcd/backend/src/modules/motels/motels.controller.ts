import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MotelsService } from './motels.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('motels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MotelsController {
  constructor(private readonly motelsService: MotelsService) {}

  @Post()
  @Roles(Role.LANDLORD)
  async createMotel(@CurrentUser('id') landlordId: string, @Body() body: any) {
    return await this.motelsService.createMotel(landlordId, body);
  }

  @Get('my-motels')
  @Roles(Role.LANDLORD)
  async getMyMotels(@CurrentUser('id') landlordId: string) {
    return await this.motelsService.getMotelsByLandlord(landlordId);
  }

  @Get(':id')
  async getMotelById(@Param('id') id: string) {
    return await this.motelsService.getMotelById(id);
  }

  @Put(':id')
  @Roles(Role.LANDLORD)
  async updateMotel(@Param('id') id: string, @CurrentUser('id') landlordId: string, @Body() body: any) {
    return await this.motelsService.updateMotel(id, landlordId, body);
  }

  @Delete(':id')
  @Roles(Role.LANDLORD)
  async deleteMotel(@Param('id') id: string) {
    return await this.motelsService.deleteMotel(id);
  }
}
