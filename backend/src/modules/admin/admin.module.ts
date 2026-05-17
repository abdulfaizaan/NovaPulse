import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminEventStreamService } from './event-stream.service';
import { EscalationModule } from '../../escalation/escalation.module';

@Module({
  imports: [EscalationModule],
  controllers: [AdminController],
  providers: [AdminService, AdminEventStreamService],
  exports: [AdminEventStreamService],
})
export class AdminModule {}
