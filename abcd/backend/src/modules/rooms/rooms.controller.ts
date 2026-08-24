import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  /**
   * Khách thuê & Khách vãng lai: Tìm kiếm phòng theo tiêu chí
   */
  @Get('search')
  async searchRooms(
    @Query('city') city?: string,
    @Query('district') district?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minArea') minArea?: string,
    @Query('maxArea') maxArea?: string,
    @Query('isSelfContained') isSelfContained?: string,
    @Query('status') status?: RoomStatus,
  ) {
    return await this.roomsService.searchRooms({
      city,
      district,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minArea: minArea ? parseFloat(minArea) : undefined,
      maxArea: maxArea ? parseFloat(maxArea) : undefined,
      isSelfContained: isSelfContained !== undefined ? isSelfContained === 'true' : undefined,
      status,
    });
  }

  @Get(':id')
  async getRoomById(@Param('id') id: string) {
    return await this.roomsService.getRoomById(id);
  }

  @Post(':motelId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  async createRoom(@Param('motelId') motelId: string, @Body() body: any) {
    return await this.roomsService.createRoom(motelId, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  async updateRoom(@Param('id') id: string, @Body() body: any) {
    return await this.roomsService.updateRoom(id, body);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  async updateRoomStatus(@Param('id') id: string, @Body('status') status: RoomStatus) {
    return await this.roomsService.updateRoomStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LANDLORD)
  async deleteRoom(@Param('id') id: string) {
    return await this.roomsService.deleteRoom(id);
  }
}
