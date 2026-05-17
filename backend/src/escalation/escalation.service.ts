import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class EscalationService {
  private logger = new Logger(EscalationService.name);

  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  /**
   * Check for goals pending approval for > 7 days
   * Runs every day at 9 AM
   */
  @Cron('0 9 * * *')
  async checkPendingApprovals() {
    this.logger.log('[CRON] Starting pending approvals check...');
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const pendingGoals = await this.prisma.goal.findMany({
      where: {
        status: 'submitted',
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
      include: {
        employee: true,
        approvals: true,
      },
    });

    for (const goal of pendingGoals) {
      this.logger.log(`[CRON] Escalating goal ${goal.id} pending for > 7 days`);
      
      // Create escalation record
      await this.prisma.escalation.create({
        data: {
          reason: 'Goal pending approval for more than 7 days',
          level: 2,
          targetId: goal.employee.managerId || goal.employeeId,
          status: 'OPEN',
        },
      });

      // Emit event
      await this.eventsService.emitEscalationTriggered(
        goal.id,
        'Goal',
        goal.id,
        'Goal pending approval for more than 7 days',
        null,
      );
    }

    this.logger.log(`[CRON] Pending approvals check completed. Escalated ${pendingGoals.length} goals.`);
  }

  /**
   * Check for overdue quarterly check-ins
   * Runs every Monday at 8 AM
   */
  @Cron('0 8 * * 1')
  async checkOverdueCheckins() {
    this.logger.log('[CRON] Starting overdue check-ins check...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueCheckins = await this.prisma.quarterlyCheckin.findMany({
      where: {
        status: {
          in: ['DRAFT', 'PENDING'],
        },
        cycle: {
          endDate: {
            lt: today,
          },
        },
      },
      include: {
        employee: true,
        goal: true,
      },
    });

    for (const checkin of overdueCheckins) {
      this.logger.log(`[CRON] Escalating overdue check-in ${checkin.id}`);

      await this.prisma.escalation.create({
        data: {
          reason: `Check-in for goal "${checkin.goal.title}" is overdue`,
          level: 1,
          targetId: checkin.employeeId,
          status: 'OPEN',
        },
      });

      await this.eventsService.emitEscalationTriggered(
        checkin.id,
        'QuarterlyCheckin',
        checkin.id,
        `Check-in for goal "${checkin.goal.title}" is overdue`,
        null,
      );
    }

    this.logger.log(`[CRON] Overdue check-ins check completed. Escalated ${overdueCheckins.length} check-ins.`);
  }

  /**
   * Check for goals with no progress updates in > 30 days
   * Runs every Wednesday at 10 AM
   */
  @Cron('0 10 * * 3')
  async checkStaleGoals() {
    this.logger.log('[CRON] Starting stale goals check...');

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const staleGoals = await this.prisma.goal.findMany({
      where: {
        status: 'locked',
        updatedAt: {
          lt: thirtyDaysAgo,
        },
      },
      include: {
        employee: true,
      },
    });

    for (const goal of staleGoals) {
      this.logger.log(`[CRON] Escalating stale goal ${goal.id}`);

      await this.prisma.escalation.create({
        data: {
          reason: 'No progress updates in 30+ days',
          level: 1,
          targetId: goal.employee.managerId || goal.employeeId,
          status: 'OPEN',
        },
      });

      await this.eventsService.emitEscalationTriggered(
        goal.id,
        'Goal',
        goal.id,
        'No progress updates in 30+ days',
        null,
      );
    }

    this.logger.log(`[CRON] Stale goals check completed. Escalated ${staleGoals.length} goals.`);
  }

  /**
   * Daily system health check and event logging
   * Runs every day at 12 AM UTC
   */
  @Cron('0 0 * * *')
  async dailyHealthCheck() {
    this.logger.log('[CRON] Running daily health check...');

    try {
      const dbHealthy = await this.prisma.$queryRaw`SELECT 1`;
      const userCount = await this.prisma.user.count();
      const goalCount = await this.prisma.goal.count();
      const openEscalations = await this.prisma.escalation.count({
        where: { status: 'OPEN' },
      });

      this.logger.log(
        `[CRON] Health check passed. Users: ${userCount}, Goals: ${goalCount}, Open Escalations: ${openEscalations}`,
      );

      await this.eventsService.emitSystemEvent('SYSTEM_HEALTH_CHECK', {
        database: 'healthy',
        timestamp: new Date(),
        metrics: {
          userCount,
          goalCount,
          openEscalations,
        },
      });
    } catch (error) {
      this.logger.error('[CRON] Health check failed', error);
      await this.eventsService.emitSystemEvent('SYSTEM_HEALTH_CHECK_FAILED', {
        database: 'unhealthy',
        error: error.message,
        timestamp: new Date(),
      });
    }
  }
}
