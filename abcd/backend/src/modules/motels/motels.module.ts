import { Module } from '@nestjs/common';
import { MotelsService } from './motels.service';
import { MotelsController } from './motels.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [MotelsController],
  providers: [MotelsService],
  exports: [MotelsService],
})
export class MotelsModule {}
