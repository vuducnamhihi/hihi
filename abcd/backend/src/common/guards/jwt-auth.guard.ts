import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In development / demo mode, if mock user header is present, allow testing
      if (request.headers['x-demo-user-id']) {
        request.user = {
          id: request.headers['x-demo-user-id'],
          phoneNumber: request.headers['x-demo-user-phone'] || '0901234567',
          role: request.headers['x-demo-user-role'] || 'LANDLORD',
          fullName: request.headers['x-demo-user-name'] || 'Demo User',
        };
        return true;
      }
      throw new UnauthorizedException('Chưa cung cấp Bearer Token hoặc token không hợp lệ');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'supersecret_jwt_key_for_nhatro_system_2026',
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token đã hết hạn hoặc không hợp lệ');
    }
  }
}
