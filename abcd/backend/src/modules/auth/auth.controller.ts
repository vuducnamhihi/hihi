import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-otp')
  async loginWithOtp(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
    @Body('role') role: Role,
    @Body('fullName') fullName?: string,
  ) {
    return await this.authService.loginWithPhoneOtp(phoneNumber, otp, role, fullName);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('id') userId: string) {
    return await this.authService.getProfile(userId);
  }

  @Get('demo-users')
  async getDemoUsers() {
    return await this.authService.getAllDemoUsers();
  }
}
