import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EscalationService } from './escalation.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, EventsModule],
  providers: [EscalationService],
  exports: [EscalationService],
})
export class EscalationModule {}
