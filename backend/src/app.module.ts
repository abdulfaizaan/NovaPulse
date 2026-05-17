import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { GoalsModule } from './modules/goals/goals.module';
import { CheckinsModule } from './modules/checkins/checkins.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReportsModule } from './modules/reports/reports.module';
import { EventsModule } from './events/events.module';
import { EscalationModule } from './escalation/escalation.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { GoalsGateway } from './gateways/goals.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    GoalsModule,
    CheckinsModule,
    AdminModule,
    ReportsModule,
    EventsModule,
    EscalationModule,
    WebhooksModule,
  ],
  providers: [GoalsGateway],
})
export class AppModule {}
