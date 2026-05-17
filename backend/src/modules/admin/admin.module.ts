import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminEventStreamService } from './event-stream.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, AdminEventStreamService],
  exports: [AdminEventStreamService],
})
export class AdminModule {}
